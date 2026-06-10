import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FileUploader } from "@/components/uploads/FileUploader";

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Upload Documents
          </h1>

          <p className="text-sm text-gray-400 mt-0.5">
            Upload and preview CQI documents
          </p>
        </div>
      </div>

      <FileUploader />
    </div>
  );
}