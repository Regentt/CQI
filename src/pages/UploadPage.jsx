import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { FileUploader } from "@/components/uploads/FileUploader";
import { useState } from "react";


export default function UploadPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

 return (
  <div>
    <h1>TEST UPLOAD PAGE</h1>
  </div>
);
}