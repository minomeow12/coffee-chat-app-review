import { Menu, X } from "lucide-react";
import { UserAvatar } from "../../../components/UserAvatar";

interface ChatHeaderProps {
  selectedUser: any;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isOnline: (userId: string) => boolean;
}

export function ChatHeader({
  selectedUser,
  isSidebarOpen,
  onToggleSidebar,
  isOnline,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center border-b border-border bg-card px-4 py-3">
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-foreground hover:bg-accent md:hidden mr-2"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {selectedUser && (
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              userId={selectedUser.value}
              label={selectedUser.label}
              color={selectedUser.color}
            />
            {isOnline(selectedUser.value) && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              {selectedUser.label}
            </h2>
            <p className="text-xs text-foreground/70">
              {isOnline(selectedUser.value) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
