import { act, renderHook } from "@testing-library/react";
import { useCounter, useFetch, useLocalStorage } from "./hooks";

describe("Custom Hooks Tests", () => {
  describe("useCounter", () => {
    test("initializes with default value of 0", () => {
      const { result } = renderHook(() => useCounter());
      expect(result.current.count).toBe(0);
    });

    test("initializes with custom initial value", () => {
      const { result } = renderHook(() => useCounter(10));
      expect(result.current.count).toBe(10);
    });

    test("increments count correctly", () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(6);
    });

    test("decrements count correctly", () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(4);
    });

    test("resets count to initial value", () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(12);

      act(() => {
        result.current.reset();
      });

      expect(result.current.count).toBe(10);
    });

    test("handles multiple operations", () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.decrement();
      });

      expect(result.current.count).toBe(1);
    });
  });

  describe("useLocalStorage", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test("returns initial value when localStorage is empty", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial")
      );
      expect(result.current[0]).toBe("initial");
    });

    test("stores and retrieves string values", () => {
      const { result } = renderHook(() => useLocalStorage("test-key", ""));

      act(() => {
        result.current[1]("test value");
      });

      expect(result.current[0]).toBe("test value");
      expect(localStorage.getItem("test-key")).toBe('"test value"');
    });

    test("stores and retrieves object values", () => {
      const testObject = { name: "John", age: 30 };
      const { result } = renderHook(() => useLocalStorage("test-object", {}));

      act(() => {
        result.current[1](testObject);
      });

      expect(result.current[0]).toEqual(testObject);
    });

    test("stores and retrieves array values", () => {
      const testArray = [1, 2, 3, 4, 5];
      const { result } = renderHook(() => useLocalStorage("test-array", []));

      act(() => {
        result.current[1](testArray);
      });

      expect(result.current[0]).toEqual(testArray);
    });

    test("handles localStorage errors gracefully", () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage quota exceeded");
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial")
      );

      act(() => {
        result.current[1]("new value");
      });

      expect(consoleSpy).toHaveBeenCalled();

      // Restore original functions
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe("useFetch", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("initializes with correct default state", () => {
      const { result } = renderHook(() => useFetch());

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    test("handles successful fetch", async () => {
      const mockData = { id: 1, name: "Test" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result, waitForNextUpdate } = renderHook(() =>
        useFetch("https://api.example.com/data")
      );

      expect(result.current.loading).toBe(true);

      await waitForNextUpdate();

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test("handles fetch error", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      const { result, waitForNextUpdate } = renderHook(() =>
        useFetch("https://api.example.com/data")
      );

      await waitForNextUpdate();

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network error");
    });

    test("handles HTTP error responses", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result, waitForNextUpdate } = renderHook(() =>
        useFetch("https://api.example.com/data")
      );

      await waitForNextUpdate();

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("HTTP error! status: 404");
    });

    test("does not fetch when url is null or undefined", () => {
      renderHook(() => useFetch(null));
      renderHook(() => useFetch(undefined));

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
