import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatApp } from "../ChatApp";

// ---- Capture props passed into mocked children ----
let lastSidebarProps: any = null;
let lastChatMessageProps: any = null;

// Mock child components to keep this test focused on ChatApp logic
jest.mock("../ChatSidebar", () => ({
  ChatSidebar: (props: any) => {
    lastSidebarProps = props;
    return (
      <div>
        <button
          data-testid="select-user-b"
          onClick={() =>
            props.onSelectUser({ label: "User B", value: "userB" })
          }
        >
          Select User B
        </button>
      </div>
    );
  },
}));

jest.mock("../ChatHeader", () => ({
  ChatHeader: () => <div data-testid="header" />,
}));

jest.mock("../ChatInput", () => ({
  ChatInput: () => <div data-testid="input" />,
}));

jest.mock("../ChatMessage", () => ({
  ChatMessage: (props: any) => {
    lastChatMessageProps = props;
    return (
      <div data-testid="messages-count">{props.messages?.length ?? 0}</div>
    );
  },
}));

// Mock current user context
jest.mock("../../../../context/UserContext", () => ({
  useUser: () => ({ user: { id: "me" } }),
}));

// ---- Mock socketClient and capture the handler ChatApp registers ----
let capturedHandler: ((msg: any) => void) | null = null;

jest.mock("../../../../lib/socketClient", () => ({
  initializeSocket: jest.fn(),
  setMessageHandler: jest.fn((handler: (msg: any) => void) => {
    capturedHandler = handler;
  }),
}));

describe("ChatApp socket handling", () => {
  beforeEach(() => {
    capturedHandler = null;
    lastSidebarProps = null;
    lastChatMessageProps = null;
    jest.clearAllMocks();
  });

  it("registers exactly one message handler and appends incoming message once", async () => {
    render(<ChatApp />);

    // Select a conversation so ChatMessage is shown
    await userEvent.click(screen.getByTestId("select-user-b"));

    // ChatApp should have registered a handler
    expect(typeof capturedHandler).toBe("function");

    const msg = {
      _id: "m1",
      sender: "userB",
      recipient: "me",
      content: "hello",
      timestamp: new Date().toISOString(),
    };

    // Fire receive once
    act(() => {
      capturedHandler?.(msg);
    });

    expect(screen.getByTestId("messages-count")).toHaveTextContent("1");

    // Fire same message again -> dedupe by _id
    act(() => {
      capturedHandler?.(msg);
    });

    expect(screen.getByTestId("messages-count")).toHaveTextContent("1");
  });

  it("increments unread count when message arrives from non-selected sender", async () => {
    render(<ChatApp />);

    // Select User B
    await userEvent.click(screen.getByTestId("select-user-b"));

    expect(typeof capturedHandler).toBe("function");

    // Message from User C while we are viewing User B
    const msgFromC = {
      _id: "m2",
      sender: "userC",
      recipient: "me",
      content: "yo from C",
      timestamp: new Date().toISOString(),
    };

    act(() => {
      capturedHandler?.(msgFromC);
    });

    // Our mocked ChatSidebar stores last props in lastSidebarProps
    expect(lastSidebarProps?.unreadCounts?.userC).toBe(1);

    // Another message from User C => unread increments
    const msgFromCAgain = { ...msgFromC, _id: "m3", content: "again" };
    act(() => {
      capturedHandler?.(msgFromCAgain);
    });

    expect(lastSidebarProps?.unreadCounts?.userC).toBe(2);
  });

  it("does NOT increment unread count for selected conversation sender", async () => {
    render(<ChatApp />);

    // Select User B
    await userEvent.click(screen.getByTestId("select-user-b"));

    const msgFromB = {
      _id: "m4",
      sender: "userB",
      recipient: "me",
      content: "in current chat",
      timestamp: new Date().toISOString(),
    };

    act(() => {
      capturedHandler?.(msgFromB);
    });

    // unread for userB should remain 0 (or undefined) because it's currently selected
    expect(lastSidebarProps?.unreadCounts?.userB ?? 0).toBe(0);
  });
});
