import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

jest.mock("next/link", () => {
  const MockLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "Link";
  return MockLink;
});

describe("Header", () => {
  it("renders a link to the home page", () => {
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders a link to the transactions page", () => {
    render(<Header />);
    const transactionsLink = screen.getByRole("link", { name: "Transactions" });
    expect(transactionsLink).toBeInTheDocument();
    expect(transactionsLink).toHaveAttribute("href", "/transactions");
  });
});
