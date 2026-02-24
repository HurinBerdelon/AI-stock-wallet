import { render, screen, fireEvent } from "@testing-library/react";
import { FillDatabase } from "@/components/FillDatabase";

const STORAGE_KEY = "stock_transactions";

beforeEach(() => {
  localStorage.clear();
});

describe("FillDatabase", () => {
  it("renders a button", () => {
    render(<FillDatabase />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("saves 10 transactions to localStorage when button is clicked", () => {
    render(<FillDatabase />);
    fireEvent.click(screen.getByRole("button"));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toHaveLength(10);
  });

  it("each saved transaction has all required fields", () => {
    render(<FillDatabase />);
    fireEvent.click(screen.getByRole("button"));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    stored.forEach((t: Record<string, unknown>) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.ticker).toBeDefined();
      expect(t.quantity).toBeDefined();
      expect(t.pricePaid).toBeDefined();
      expect(t.date).toBeDefined();
    });
  });

  it("transactions have dates across 2025 and 2026", () => {
    render(<FillDatabase />);
    fireEvent.click(screen.getByRole("button"));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    const years = stored.map((t: Record<string, unknown>) =>
      new Date(t.date as string).getFullYear()
    );
    expect(years).toContain(2025);
    expect(years).toContain(2026);
  });

  it("overwrites localStorage with the 10 sample transactions on each click", () => {
    render(<FillDatabase />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toHaveLength(10);
  });
});
