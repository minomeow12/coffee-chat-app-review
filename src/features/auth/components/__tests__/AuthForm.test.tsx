import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "../AuthForm";
import { apiClient } from "../../../../lib/apiClient";
import { toast } from "sonner";

jest.mock("../../../../lib/apiClient", () => ({
  apiClient: { post: jest.fn() },
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock("../../../../context/UserContext", () => ({
  useUser: () => ({ setUser: jest.fn() }),
}));

describe("AuthForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders Sign In mode by default", () => {
    render(<AuthForm mounted={true} />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("submits sign in and shows success toast", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: "u1" } },
    });

    render(<AuthForm mounted={true} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "a@a.com");
    await user.type(screen.getByLabelText(/password/i), "pw123456");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(apiClient.post).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows error toast on failed sign in", async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error("bad"));

    render(<AuthForm mounted={true} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "a@a.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(toast.error).toHaveBeenCalled();
  });
});
