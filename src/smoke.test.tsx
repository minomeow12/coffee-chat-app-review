import { render, screen } from "@testing-library/react";

test("smoke test", () => {
  render(<h1>Hello Test</h1>);
  expect(screen.getByText("Hello Test")).toBeInTheDocument();
});
