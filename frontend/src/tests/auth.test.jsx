import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";

describe("Auth Pages UI Tests", () => {
  it("renders LoginPage with Poster Modernist layout and elements", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /WELCOME BACK\./i })).toBeInTheDocument();
    expect(screen.getByLabelText("EMAIL ADDRESS")).toBeInTheDocument();
    expect(screen.getByLabelText("PASSWORD")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SIGN IN/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
  });

  it("renders RegisterPage with Poster Modernist layout and elements", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /CREATE YOUR WORKSPACE\./i })).toBeInTheDocument();
    expect(screen.getByLabelText("FIRST NAME")).toBeInTheDocument();
    expect(screen.getByLabelText("LAST NAME")).toBeInTheDocument();
    expect(screen.getByLabelText("EMAIL ADDRESS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /CREATE ACCOUNT/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
  });
});
