import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Bot, DownloadIcon } from "lucide-react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mammoth from "mammoth";
import { useState } from "react";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import ChatAvatarActions from "./chat-avatar-actions";

type ChatBubbleProps = {
  message: IMessage;
  me: any;
  previousMessage?: IMessage;
};

const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {
  const date = new Date(message._creationTime);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;

  const { selectedConversation } = useConversationStore();
  const isMember =
    selectedConversation?.participants.includes(message.sender?._id) || false;
  const isGroup = selectedConversation?.isGroup;
  const fromMe = message.sender?._id === me._id;
  const fromAI = message.sender?.name === "ChatGPT";
  const bgClass = fromMe
    ? "bg-green-chat"
    : !fromAI
      ? "bg-white dark:bg-gray-primary"
      : "bg-blue-500 text-white";

  console.log(message.sender);
  const [open, setOpen] = useState(false);

  const renderMessageContent = () => {
    switch (message.messageType) {
      case "text":
        return <TextMessage message={message} />;
      case "image":
      case "gifs":
        return (
          <ImageMessage message={message} handleClick={() => setOpen(true)} />
        );
      case "video":
        return <VideoMessage message={message} />;
      case "docs":
        return <DocsMessage message={message} />;
      case "audio":
        return <AudioMessage message={message} />;
      case "gifs":
        return <GifMessage message={message} />;
      case "location":
        return <LocationMessage message={message} />;
      default:
        return null;
    }
  };

  if (!fromMe) {
    return (
      <>
        <DateIndicator message={message} previousMessage={previousMessage} />
        <div className="flex gap-1 w-2/3">
          <ChatBubbleAvatar
            isGroup={isGroup}
            isMember={isMember}
            message={message}
            fromAI={fromAI}
          />
          <div
            className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}
          >
            <OtherMessageIndicator />
            {isGroup && <ChatAvatarActions message={message} me={me} />}
            {/* {fromAI && <Bot size={16} className='absolute bottom-[2px] left-2' />} */}
            {/* {message.messageType==="text"&& <TextMessage message={message} />}
						{message.messageType==="image"&& <ImageMessage message={message}
							handleClick={() => setOpen(true)} 
						/>}
						{message.messageType==="video"&& <VideoMessage message={message}/>} */}

            {renderMessageContent()}
            {open && (
              <ImageDialog
                src={message.content}
                open={open}
                onClose={() => setOpen(false)}
              />
            )}
            <MessageTime time={time} fromMe={fromMe} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />

      <div className="flex gap-1 w-2/3 ml-auto">
        <div
          className={`flex  z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}
        >
          <SelfMessageIndicator />
          {/* {message.messageType==="text"&& <TextMessage message={message} />}
					{message.messageType==="image"&& <ImageMessage message={message} 
						handleClick={() => setOpen(true)} 
					/>}
					{message.messageType==="video"&& <VideoMessage message={message}/>} */}
          {renderMessageContent()}
          {open && (
            <ImageDialog
              src={message.content}
              open={open}
              onClose={() => setOpen(false)}
            />
          )}
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};
export default ChatBubble;

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <ReactPlayer
      url={message.content}
      width="250px"
      height="250px"
      controls={true}
      light={true}
    />
  );
};
const AudioMessage = ({ message }: { message: IMessage }) => {
  return (
    
      <audio controls style={{
        width: "200px", // Change width to 100%
        height: "50px", // Change height to 50px
      }}>
        <source src={message.content} />
      </audio>
  );
};
const GifMessage = ({ message }: { message: IMessage }) => {
  return (
    
      <Image
        src={message.content}
        fill
        className="cursor-pointer object-cover rounded"
        alt="gifs"
      />
  );
};
const LocationMessage = ({ message }: { message: IMessage }) => {
  const locationUrl = message.content;
  return (
    <div>
      <a href={locationUrl} target="_blank" rel="noopener noreferrer">
        View Location
      </a>
    </div>
  );
};

const DocsMessage = ({ message }: { message: IMessage }) => {
  const fileType = message.content.split(".").pop();
  const fileName = message.content.split("/").pop();

  const handleOpenFile = () => {
    window.open(message.content, "_blank");
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = message.content;
    link.download = fileName || "file"; // Add a default value if fileName is undefined
    link.click();
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-white dark:bg-gray-primary cursor-pointer">
      <div className="w-4 h-4 bg-gray-400 rounded-full" />
      <div className="flex-1" onClick={handleOpenFile}>
        <span className="text-sm font-medium">{fileName}</span>
        <span className="text-xs text-gray-500">{fileType}</span>
      </div>
      <button
        className="text-sm text-blue-400 underline"
        onClick={(e) => {
          e.stopPropagation();
          handleDownloadFile();
        }}
      >
        <DownloadIcon size={16} />
      </button>
    </div>
  );
};

const ImageMessage = ({
  message,
  handleClick,
}: {
  message: IMessage;
  handleClick: () => void;
}) => {
  return (
    <div className="w-[250px] h-[250px] m-2 relative">
      <Image
        src={message.content}
        fill
        className="cursor-pointer object-cover rounded"
        alt="image"
        onClick={handleClick}
      />
    </div>
  );
};

const ImageDialog = ({
  src,
  onClose,
  open,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="min-w-[750px]">
        <DialogTitle>
          <DialogDescription className="relative h-[450px] flex justify-center">
            <Image
              src={src}
              fill
              className="rounded-lg object-contain"
              alt="image"
            />
          </DialogDescription>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
  return (
    <p className="text-[10px] mt-2 self-end flex gap-1 items-center">
      {time} {fromMe && <MessageSeenSvg />}
    </p>
  );
};

const OtherMessageIndicator = () => (
  <div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full" />
);

const SelfMessageIndicator = () => (
  <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />
);

const TextMessage = ({ message }: { message: IMessage }) => {
  const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

  return (
    <div>
      {isLink ? (
        <a
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className={`mr-2 text-sm font-light text-blue-400 underline`}
        >
          {message.content}
        </a>
      ) : (
        <p className={`mr-2 text-sm font-light`}>{message.content}</p>
      )}
    </div>
  );
};
