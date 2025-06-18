import { describe, expect, test } from "vitest";
import { getByRole, getByText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios, { isAxiosError } from "axios";
import { BACKEND_URL } from "../../../src/constants";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

describe("Search page", () => {
  test('should show "No results from search"', async () => {
    let results: { title: string }[] = [];

    const urlToRequestSearch = `${BACKEND_URL}/api/posts/search/by-text?q=none`;

    const response = await fetch(urlToRequestSearch);
    console.log(response);
    const responseData = await response.json();
    console.log(responseData);

    results = [...responseData.results];

    render(
      <section>
        {results.length === 0 ? (
          <h1>No results found</h1>
        ) : (
          <>
            <h1>results:</h1>
            <ul></ul>
          </>
        )}
      </section>
    );

    const h1Element = screen.getByRole("heading");
    expect(h1Element).toHaveTextContent(/no results/i);
  });
});
