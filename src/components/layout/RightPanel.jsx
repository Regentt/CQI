import { useUIStore } from "@/store/uiStore";
import { ChevronLeft } from "lucide-react";

export function RightPanel() {
  const { rightPanelOpen, toggleRightPanel } = useUIStore();

  return (
    <>
      {/* Arrow button (middle right) */}
      <button
        onClick={toggleRightPanel}
        className="fixed top-1/2 right-0 z-50 -translate-y-1/2
                   bg-white border shadow-md p-2 rounded-l-lg"
      >
        <ChevronLeft
          className={`transition-transform duration-300 ${
            rightPanelOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg border-l
        transform transition-transform duration-300 z-40
        ${rightPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4">
          <h2 className="font-semibold">Help</h2>
          <p className="text-sm text-gray-500 mt-2">
            HELPHELPHELP
          </p>
        </div>
      </div>
    </>
  );
}