import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component Tests", () => {
  test("renders learn react link", () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("renders the React logo", () => {
    render(<App />);
    const logoElement = screen.getByAltText("logo");
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass("App-logo");
  });

  test("renders the main app container", () => {
    render(<App />);
    const appElement = screen.getByText(/edit/i).closest(".App");
    expect(appElement).toBeInTheDocument();
  });

  test("renders the header section", () => {
    render(<App />);
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass("App-header");
  });

  test("renders edit instruction text", () => {
    render(<App />);
    const editText = screen.getByText(/edit/i);
    expect(editText).toBeInTheDocument();
    expect(editText).toHaveTextContent("Edit src/App.js and save to reload.");
  });

  test("learn react link has correct attributes", () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toHaveAttribute("href", "https://reactjs.org");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkElement).toHaveClass("App-link");
  });

  test("logo image has correct source", () => {
    render(<App />);
    const logoElement = screen.getByAltText("logo");
    expect(logoElement).toHaveAttribute("src", "logo.svg");
  });

  test("app renders without crashing", () => {
    const div = document.createElement("div");
    render(<App />, { container: div });
    expect(div).toBeInTheDocument();
  });

  test("contains code element for file path", () => {
    render(<App />);
    const codeElement = screen.getByText("src/App.js");
    expect(codeElement.tagName).toBe("CODE");
  });

  test("header contains all expected elements", () => {
    render(<App />);
    const header = screen.getByRole("banner");

    // Check for logo
    expect(header).toContainElement(screen.getByAltText("logo"));

    // Check for edit text
    expect(header).toContainElement(screen.getByText(/edit/i));

    // Check for learn react link
    expect(header).toContainElement(screen.getByText(/learn react/i));
  });

  test("app has proper semantic structure", () => {
    render(<App />);

    // Should have exactly one main app div
    const appDivs = document.querySelectorAll(".App");
    expect(appDivs).toHaveLength(1);

    // Should have exactly one header
    const headers = screen.getAllByRole("banner");
    expect(headers).toHaveLength(1);
  });

  test("external link opens in new tab", () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);

    // Simulate click
    fireEvent.click(linkElement);

    // Verify link attributes for security and UX
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });
});
