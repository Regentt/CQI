import {
  FileText,
  Image,
  FileSpreadsheet,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
} from "lucide-react";

function MimeIcon({ mime, size = 15 }) {
  if (mime?.startsWith("image/"))
    return <Image size={size} className="text-sky-500 flex-shrink-0" />;
  if (mime?.includes("sheet") || mime?.includes("excel"))
    return (
      <FileSpreadsheet size={size} className="text-emerald-600 flex-shrink-0" />
    );
  if (mime === "application/pdf")
    return <FileText size={size} className="text-rose-500 flex-shrink-0" />;
  if (mime?.includes("word"))
    return <FileText size={size} className="text-blue-500 flex-shrink-0" />;
  return <File size={size} className="text-gray-400 flex-shrink-0" />;
}

function StatusIcon({ status }) {
  if (status === "done")
    return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
  if (status === "failed")
    return <AlertCircle size={14} className="text-red-500 flex-shrink-0" />;
  if (status === "uploading" || status === "processing")
    return (
      <Loader2 size={14} className="text-blue-500 animate-spin flex-shrink-0" />
    );
  return null;
}

function fmtSize(b) {
  return b > 1_048_576
    ? `${(b / 1_048_576).toFixed(1)} MB`
    : `${(b / 1024).toFixed(0)} KB`;
}

export function FileRow({ item, active, onClick, onRemove }) {
  const { file, status, progress } = item;

  return (
    <div
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border
        transition-all group
        ${
          active
            ? "border-violet-300 bg-violet-50/60"
            : "border-gray-100 bg-white hover:border-gray-200"
        }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
      >
        <MimeIcon mime={file.type} size={15} />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 truncate leading-none mb-0.5">
            {file.name}
          </p>
          <p className="text-[10px] text-gray-400">{fmtSize(file.size)}</p>

          {/* Progress bar */}
          {(status === "uploading" || status === "processing") &&
            progress > 0 && (
              <div className="mt-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
        </div>
      </button>

      {/* Right side: status icon + preview hint + remove */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <StatusIcon status={status} />

        {/* Eye icon on hover */}
        <button
          type="button"
          onClick={onClick}
          className="p-0.5 rounded text-gray-300 hover:text-violet-500
                     opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Preview"
        >
          <Eye size={13} />
        </button>

        {/* Remove (queued only) */}
        {status === "queued" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-0.5 rounded hover:bg-gray-100 text-gray-300
                       hover:text-red-400 transition-colors"
            aria-label="Remove file"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
