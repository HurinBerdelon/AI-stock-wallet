import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home (Landing Page)", () => {
  it("renders the product name heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "AI Stock Wallet", level: 1 })).toBeInTheDocument();
  });

  it("renders the hero tagline", () => {
    render(<Home />);
    expect(
      screen.getByText(/Manage your stock portfolio smarter with AI-powered insights/i)
    ).toBeInTheDocument();
  });

  it("renders sign up buttons", () => {
    render(<Home />);
    const signUpButtons = screen.getAllByRole("button", { name: /sign up/i });
    expect(signUpButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the features section heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /Why AI Stock Wallet/i })
    ).toBeInTheDocument();
  });

  it("renders the Portfolio Tracking feature", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Portfolio Tracking" })).toBeInTheDocument();
  });

  it("renders the AI-Powered Insights feature", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "AI-Powered Insights" })).toBeInTheDocument();
  });

  it("renders the Transaction Management feature", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Transaction Management" })).toBeInTheDocument();
  });

  it("renders the CTA banner heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /Ready to take control of your investments/i })
    ).toBeInTheDocument();
  });
});
