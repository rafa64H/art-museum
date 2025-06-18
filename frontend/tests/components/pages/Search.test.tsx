import { describe, expect, test } from "vitest";
import { getByRole, getByText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Search page", () => {
  test('should show "No results from search"', () => {
    render(<h1>hola</h1>);

    const h1Element = screen.getByRole("heading");
    expect(h1Element).toHaveTextContent("hola");
  });
});
