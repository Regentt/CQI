import { useState, useCallback, useRef } from "react";
import { uploadApi } from "@/api/uploadApi";
import toast from "react-hot-toast";

export function usePDFUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const pollRefs = useRef({});

  const addFiles = useCallback(
    (newFiles) => {
      const MAX = 7;
      const filtered = newFiles
        .filter((f) => f.type === "application/pdf")
        .slice(0, MAX - files.length);

      if (filtered.length < newFiles.length)
        toast.error("Only PDF files allowed. Max 7 files.");

      setFiles((prev) => [
        ...prev,
        ...filtered.map((f) => ({
          file: f,
          id: null,
          status: "queued",
          progress: 0,
          error: null,
        })),
      ]);
    },
    [files.length],
  );

  const removeFile = useCallback((idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const pollStatus = (uploadId, idx) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await uploadApi.getStatus(uploadId);
        setFiles((prev) =>
          prev.map((f, i) =>
            i === idx
              ? { ...f, status: data.status, parsed_data: data.parsed_data }
              : f,
          ),
        );
        if (["done", "failed"].includes(data.status)) {
          clearInterval(interval);
          delete pollRefs.current[uploadId];
          if (data.status === "done")
            toast.success(`✓ ${data.original_name} processed`);
          if (data.status === "failed")
            toast.error(`✗ ${data.original_name} failed`);
        }
      } catch {
        clearInterval(interval);
      }
    }, 2000);
    pollRefs.current[uploadId] = interval;
  };

  const upload = useCallback(
    async (fileType) => {
      if (!files.length) return;
      setUploading(true);
      try {
        const rawFiles = files.map((f) => f.file);
        const { data } = await uploadApi.upload( 
          fileType,
          rawFiles,
          (pct) => {
            setFiles((prev) => prev.map((f) => ({ ...f, progress: pct })));
          },
        );

        setFiles((prev) =>
          prev.map((f, i) => ({
            ...f,
            id: data[i]?.id,
            status: "processing",
          })),
        );
        data.forEach((d, i) => pollStatus(d.id, i));
        toast.success(`${data.length} file(s) uploaded. Processing...`);
      } catch (e) {
        toast.error("Upload failed: " + e.response?.data?.detail);
      } finally {
        setUploading(false);
      }
    },
    [files],
  );

  return { files, addFiles, removeFile, upload, uploading };
}
