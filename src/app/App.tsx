import { UserProvider, useUser } from "../context/UserContext";
import { AuthPage } from "../features/auth/components/AuthPage";
import { Toaster } from "../components/ui/sonner";
import { AppLoading } from "../components/layout/AppLoading";
import { ChatApp } from "../features/chat/components/ChatApp";
import { ProfileSetup } from "../features/auth/components/ProfileSetup";

function AppContent() {
  const { user, isLoading, logout } = useUser();

  if (isLoading) return <AppLoading />;
  if (!user) return <AuthPage />;

  if (!user.profileSetup) return <ProfileSetup />;
  return <ChatApp />;

  //temporary placeholder until we build the main app
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-xl font-semibold text-foreground">
          🎉 Profile complete!
        </p>

        <button
          onClick={logout}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
      <Toaster position="top-center" />
    </UserProvider>
  );
}
