import {
  calculateAge,
  debounce,
  formatCurrency,
  formatUserName,
  validateEmail,
} from "./utils";

describe("Utility Functions Tests", () => {
  describe("formatUserName", () => {
    test("returns full name when both first and last names are provided", () => {
      expect(formatUserName("John", "Doe")).toBe("John Doe");
    });

    test("returns first name only when last name is not provided", () => {
      expect(formatUserName("John", "")).toBe("John");
      expect(formatUserName("John", null)).toBe("John");
      expect(formatUserName("John", undefined)).toBe("John");
    });

    test("returns last name only when first name is not provided", () => {
      expect(formatUserName("", "Doe")).toBe("Doe");
      expect(formatUserName(null, "Doe")).toBe("Doe");
      expect(formatUserName(undefined, "Doe")).toBe("Doe");
    });

    test("returns Anonymous User when both names are not provided", () => {
      expect(formatUserName("", "")).toBe("Anonymous User");
      expect(formatUserName(null, null)).toBe("Anonymous User");
      expect(formatUserName(undefined, undefined)).toBe("Anonymous User");
    });

    test("handles whitespace correctly", () => {
      expect(formatUserName("John ", " Doe")).toBe("John   Doe");
    });
  });

  describe("validateEmail", () => {
    test("returns true for valid email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("firstname+lastname@example.com")).toBe(true);
      expect(validateEmail("email@123.123.123.123")).toBe(true);
    });

    test("returns false for invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test..email@example.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("test@example")).toBe(false);
    });

    test("handles edge cases", () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail("   ")).toBe(false);
    });
  });

  describe("calculateAge", () => {
    test("calculates age correctly for past birthdate", () => {
      const birthDate = "1990-01-01";
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThan(30);
    });

    test("returns 0 for current year birth", () => {
      const currentYear = new Date().getFullYear();
      const birthDate = `${currentYear}-01-01`;
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(0);
    });

    test("handles birthday not yet occurred this year", () => {
      const currentDate = new Date();
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        1
      );
      const birthDate = nextMonth.toISOString().split("T")[0];
      const age = calculateAge(
        `${currentDate.getFullYear() - 25}-${String(
          nextMonth.getMonth() + 1
        ).padStart(2, "0")}-01`
      );
      expect(age).toBe(24);
    });

    test("handles different date formats", () => {
      expect(calculateAge("2000-12-25")).toBeGreaterThan(20);
      expect(calculateAge("1985/06/15")).toBeGreaterThan(35);
    });
  });

  describe("formatCurrency", () => {
    test("formats USD currency by default", () => {
      expect(formatCurrency(100)).toBe("$100.00");
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    test("formats different currencies", () => {
      expect(formatCurrency(100, "EUR")).toBe("€100.00");
      expect(formatCurrency(100, "GBP")).toBe("£100.00");
    });

    test("handles zero and negative amounts", () => {
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(-50)).toBe("-$50.00");
    });

    test("handles large numbers", () => {
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });

    test("handles decimal amounts", () => {
      expect(formatCurrency(99.99)).toBe("$99.99");
      expect(formatCurrency(0.01)).toBe("$0.01");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    test("calls function after specified delay", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("cancels previous call when called again within delay", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("passes arguments correctly", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1", "arg2");
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    });

    test("handles multiple calls with different arguments", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("first");
      debouncedFn("second");

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("second");
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});
