import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Heart, Laugh, ThumbsUp, Frown } from "lucide-react";

const StatusReactions = ({ statusId }: { statusId: any }) => {
  const reactions = useQuery(api.status.getReactions, { statusId });

  return (
    <div className="flex gap-2">
      {reactions?.map((reaction) => (
        <button key={reaction._id} className="p-2 bg-gray-200 rounded-md">
          {reaction.type === "like" ? (
            <ThumbsUp size={20} />
          ) : reaction.type === "love" ? (
            <Heart size={20} />
          ) : reaction.type === "laugh" ? (
            <Laugh size={20} />
          ) : reaction.type === "sad" ? (
            <Frown size={20} />
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default StatusReactions;