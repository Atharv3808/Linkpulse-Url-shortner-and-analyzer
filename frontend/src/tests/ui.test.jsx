import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

describe("UI Primitives Unit Tests", () => {
  it("renders Button component with label", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
  });

  it("renders disabled loading state on Button", () => {
    render(<Button isLoading>Submitting</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("renders Badge component with text", () => {
    render(<Badge variant="active">Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
