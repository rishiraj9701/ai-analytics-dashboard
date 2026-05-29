/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useApp } from "./context/AppContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import TeamManagement from "./pages/TeamManagement";
import Projects from "./pages/Projects";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import AuthPage from "./pages/Auth";
import NotificationToast from "./components/NotificationToast";

function AppContent() {
  const { user, activePage } = useApp();

  // If unauthenticated, redirect to the secure SaaS auth page immediately!
  if (!user) {
    return (
      <>
        <AuthPage />
        <NotificationToast />
      </>
    );
  }

  // Switch router coordination
  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <Overview />;
      case "analytics":
        return <Analytics />;
      case "team":
        return <TeamManagement />;
      case "projects":
        return <Projects />;
      case "messages":
        return <Messages />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout>
      {renderPage()}
      <NotificationToast />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
