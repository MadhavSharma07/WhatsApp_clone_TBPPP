"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X } from "lucide-react";

const StatusViewer = ({ onClose }: { onClose: () => void }) => {
  const statuses = useQuery(api.status.getStatuses);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (statuses?.length) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % statuses.length);
      }, 5000); // Auto switch every 5 seconds

      return () => clearInterval(timer);
    }
  }, [statuses]);

  if (!statuses?.length) return null;

  const currentStatus = statuses[index];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center">
      <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-gray-800 text-white rounded-full">
        <X size={24} />
      </button>

      {currentStatus.type === "text" ? (
        <p className="text-white text-2xl">{currentStatus.content}</p>
      ) : (
        <img src={currentStatus.content} alt="status" className="max-h-screen max-w-full" />
      )}
    </div>
  );
};

export default StatusViewer;
