"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { Camera, Send } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const StatusUpload = ({ userId }: { userId: string }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const addStatus = useMutation(api.status.addStatus);
  const generateUploadUrl = useMutation(api.conversations._generateUploadUrl);
  
  const handleUpload = async () => {
    if (!content && !file) return;

    let statusType: "text" | "image" | "video" = "text";
    let statusContent = content;

    if (file) {
      statusType = file.type.startsWith("video") ? "video" : "image";
      const uploadUrl = await generateUploadUrl(); 
      const response = await fetch(uploadUrl, { method: "POST", body: file });
      const { storageId } = await response.json();
      statusContent = storageId;
    }

    await addStatus({ userId: userId as Id<"users">, content: statusContent, type: statusType });
    setContent("");
    setFile(null);
  };

  return (
    <div className="p-4 flex items-center gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a status..."
        className="border p-2 w-full rounded-md"
      />
      <label>
        <Camera size={24} />
        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      <button onClick={handleUpload} className="p-2 bg-blue-500 text-white rounded-md">
        <Send size={20} />
      </button>
    </div>
  );
};

export default StatusUpload;
