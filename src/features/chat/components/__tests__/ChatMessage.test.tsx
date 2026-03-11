import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ChatMessage } from "../ChatMessage";
import * as messagesApi from "../../api/messagesApi";

// Mock current user (your component uses useUser().user.id)
jest.mock("../../../../context/UserContext", () => ({
  useUser: () => ({ user: { id: "me" } }),
}));

describe("ChatMessage", () => {
  beforeAll(() => {
    // JSDOM doesn't implement scrollIntoView
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
      value: function () {},
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {}); // optional: silence noisy logs
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore?.();
  });

  it("calls getMessages(user.value), clears messages first, then sets loaded history", async () => {
    const data = [
      {
        _id: "h1",
        sender: "me",
        recipient: "userB",
        content: "history hello",
        timestamp: new Date().toISOString(),
      },
    ];

    jest.spyOn(messagesApi, "getMessages").mockResolvedValueOnce(data as any);

    const setMessages = jest.fn();

    render(
      <ChatMessage
        user={{ label: "User B", value: "userB" }}
        messages={[]}
        setMessages={setMessages}
        readMap={{}}
      />,
    );

    expect(messagesApi.getMessages).toHaveBeenCalledWith("userB");

    // ChatMessage always clears first
    expect(setMessages).toHaveBeenCalledWith([]);

    // Then it sets history when the promise resolves
    await waitFor(() => {
      expect(setMessages).toHaveBeenCalledWith(data);
    });
  });

  it("renders only messages between me and the selected user (filters out others)", async () => {
    // Prevent the effect from making a real API call in this test
    jest.spyOn(messagesApi, "getMessages").mockResolvedValueOnce([] as any);

    const messages = [
      // correct conversation (me <-> userB)
      {
        _id: "m1",
        sender: "me",
        recipient: "userB",
        content: "to B",
        timestamp: new Date().toISOString(),
      },
      {
        _id: "m2",
        sender: "userB",
        recipient: "me",
        content: "from B",
        timestamp: new Date().toISOString(),
      },
      // other conversation should be filtered out
      {
        _id: "m3",
        sender: "me",
        recipient: "userC",
        content: "to C",
        timestamp: new Date().toISOString(),
      },
    ];

    render(
      <ChatMessage
        user={{ label: "User B", value: "userB" }}
        messages={messages}
        setMessages={jest.fn()}
        readMap={{}}
      />,
    );

    expect(screen.getByText("to B")).toBeInTheDocument();
    expect(screen.getByText("from B")).toBeInTheDocument();
    expect(screen.queryByText("to C")).not.toBeInTheDocument();
  });
});
