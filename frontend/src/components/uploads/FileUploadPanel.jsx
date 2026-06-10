import { useCallback, useState } from "react";
import { Upload, CloudUpload, CheckCircle } from "lucide-react";
import { FileRow } from "./FileRow";

const FILE_TYPES = [
  { value: "co_attainment", label: "CO attainment" },
  { value: "po_attainment", label: "PO attainment" },
  { value: "student_evaluation", label: "Student evaluation" },
  { value: "instructor_feedback", label: "Instructor feedback" },
  { value: "tavolation_sheet", label: "Tavolation sheet" },
  { value: "summary", label: "Summary" },
];

export function FileUploadPanel({
  files,
  uploading,
  selectedIdx,
  onAddFiles,
  onRemoveFile,
  onSelectFile,
  onUpload,
}) {
  const [fileType, setFileType] = useState("course_file");
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      onAddFiles([...e.dataTransfer.files], fileType);
    },
    [onAddFiles, fileType],
  );

  const onInputChange = (e) => {
    onAddFiles([...e.target.files], fileType);
    e.target.value = "";
  };

  const queuedCount = files.filter((f) => f.status === "queued").length;
  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  return (
    <div className="flex flex-col gap-4 p-5">
      {/* File Type Chips */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          File type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FILE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFileType(t.value)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors
                ${
                  fileType === t.value
                    ? "bg-violet-50 border-violet-300 text-violet-700 font-medium"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onClick={() => document.getElementById("file-upload-input").click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center
          justify-center gap-2 cursor-pointer transition-all select-none min-h-[130px]
          ${
            dragging
              ? "border-violet-500 bg-violet-50/50"
              : "border-gray-200 hover:border-violet-400 hover:bg-gray-50/50"
          }`}
      >
        <CloudUpload size={26} className="text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Drop files here</p>
          <p className="text-xs text-gray-400 mt-0.5">
            PDF · 6 files max · 10 MB each
          </p>
        </div>
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((f, i) => (
            <FileRow
              key={i}
              item={f}
              active={selectedIdx === i}
              onClick={() => onSelectFile(i)}
              onRemove={() => onRemoveFile(i)}
            />
          ))}
        </div>
      )}

      {/* Upload Button */}
      {queuedCount > 0 && !uploading && (
        <button
          onClick={() => onUpload(fileType)}
          className="flex items-center justify-center gap-2 w-full
                     py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700
                     text-white text-sm font-medium transition-colors"
        >
          <Upload size={15} />
          Upload {queuedCount} file{queuedCount > 1 ? "s" : ""}
        </button>
      )}

      {uploading && (
        <div
          className="flex items-center justify-center gap-2 w-full
                        py-2.5 rounded-lg bg-violet-100 text-violet-600 text-sm font-medium"
        >
          <span
            className="w-3.5 h-3.5 rounded-full border-2 border-violet-600
                           border-t-transparent animate-spin"
          />
          Uploading…
        </div>
      )}

      {allDone && (
        <div
          className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200
                        rounded-lg text-xs font-medium text-green-700"
        >
          <CheckCircle size={14} />
          All files processed successfully!
        </div>
      )}
    </div>
  );
}
