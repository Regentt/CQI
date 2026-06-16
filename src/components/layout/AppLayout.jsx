import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { useUIStore } from "@/store/uiStore";

export function AppLayout({ children }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <Sidebar />

        <RightPanel />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}