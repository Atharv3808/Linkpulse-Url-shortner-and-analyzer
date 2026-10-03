import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LandingPage } from "../features/landing/LandingPage";

describe("LandingPage Poster Modernist Tests", () => {
  it("renders main Poster Modernist landing page elements and headlines", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Hero Headline Assertion
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/DEEP/i)).toBeInTheDocument();
    expect(screen.getByText(/INSIGHT\./i)).toBeInTheDocument();

    // Section Headings Assertion
    expect(screen.getByText(/ONE LINK\./i)).toBeInTheDocument();
    expect(screen.getByText(/NO VANITY METRICS\./i)).toBeInTheDocument();
    expect(screen.getByText(/MAKE EVERY/i)).toBeInTheDocument();

    // CTAs Assertion
    expect(screen.getByRole("button", { name: /START TRACKING/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START WITH LINKPULSE/i })).toBeInTheDocument();
  });
});
