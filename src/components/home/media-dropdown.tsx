import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DramaIcon,
  FilesIcon,
  ImageIcon,
  MapPinIcon,
  Plus,
  Video,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import ReactPlayer from "react-player";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
// import mammoth from "mammoth";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FileAudioIcon } from "lucide-react";
// import { sendLocation } from "../../../convex/messages";

const MediaDropDown = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const docsInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);
  const gifInput = useRef<HTMLInputElement>(null);
  // const locationInput = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedGif, setSelectedGif] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] =  useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateUploadUrl = useMutation(api.conversations._generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const sendVideo = useMutation(api.messages.sendVideo);
  const sendDocs = useMutation(api.messages.sendDocs);
  const sendAudio = useMutation(api.messages.sendAudio);
  const sendLocation = useMutation(api.messages.sendLocation);
  const sendGif = useMutation(api.messages.sendGif);

  const me = useQuery(api.users.getMe);

  const { selectedConversation } = useConversationStore();

  const handleSendImage = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });

      const { storageId } = await result.json();
      // // Step 3: Save the newly allocated storage id to the database
      await sendImage({
        conversation: selectedConversation!._id,
        imgId: storageId,
        sender: me!._id,
      });

      setSelectedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVideo = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedVideo!.type },
        body: selectedVideo,
      });

      const { storageId } = await result.json();

      await sendVideo({
        videoId: storageId,
        conversation: selectedConversation!._id,
        sender: me!._id,
      });

      setSelectedVideo(null);
    }  finally {
      setIsLoading(false);
    }
  };

  const handleSendDocs = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedDocs!.type },
        body: selectedDocs,
      });

      const { storageId } = await result.json();

      await sendDocs({
        DocsId: storageId,
        conversation: selectedConversation!._id,
        sender: me!._id,
      });

      setSelectedDocs(null);
    }  finally {
      setIsLoading(false);
    }
  };
  const handleSendAudio = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedAudio!.type },
        body: selectedAudio,
      });

      const { storageId } = await result.json();

      await sendAudio({
        audioId: storageId,
        conversation: selectedConversation!._id,
        sender: me!._id,
      });

      setSelectedAudio(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendGif = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedGif!.type },
        body: selectedGif,
      });

      const { storageId } = await result.json();

      await sendGif({
        gifId: storageId,
        conversation: selectedConversation!._id,
        sender: me!._id,
      });

      setSelectedGif(null);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendLocation = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedLocation),
      });

      const { storageId } = await result.json();
      await sendLocation({
        conversation: selectedConversation!._id,
        sender: me!._id,
        locationId: storageId,
      });

      setSelectedLocation(null);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setSelectedLocation(location);
      },
      (error) => {
        toast.error("Unable to retrieve your location: " + error.message);
      }
    );
  };

  return (
    <>
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files![0])}
        hidden
      />
      <input
        type="file"
        ref={videoInput}
        accept="video/mp4"
        onChange={(e) => setSelectedVideo(e.target.files![0])}
        hidden
      />
      <input
        type="file"
        ref={docsInput}
        accept=".pdf,.docx,.doc"
        onChange={(e) => setSelectedDocs(e.target.files![0])}
        hidden
      />
      <input
        type="file"
        ref={audioInput}
        accept="audio/*"
        onChange={(e) => setSelectedAudio(e.target.files![0])}
        hidden
      />
      <input
        type="file"
        ref={gifInput}
        accept="image/gif"
        onChange={(e) => setSelectedGif(e.target.files![0])}
        hidden
      />

      {selectedImage && (
        <MediaImageDialog
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage}
          isLoading={isLoading}
          handleSendImage={handleSendImage}
        />
      )}
      {selectedVideo && (
        <MediaVideoDialog
          isOpen={selectedVideo !== null}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          isLoading={isLoading}
          handleSendVideo={handleSendVideo}
        />
      )}

      {selectedDocs && (
        <MediaDocsDialog
          isOpen={selectedDocs !== null}
          onClose={() => setSelectedDocs(null)}
          selectedDocs={selectedDocs}
          isLoading={isLoading}
          handleSendDocs={handleSendDocs}
        />
      )}
      {selectedAudio && (
        <MediaAudioDialog
          isOpen={selectedAudio !== null}
          onClose={() => setSelectedAudio(null)}
          selectedAudio={selectedAudio}
          isLoading={isLoading}
          handleSendAudio={handleSendAudio}
        />
      )}
      {selectedGif && (
        <MediaGifDialog
          isOpen={selectedGif !== null}
          onClose={() => setSelectedGif(null)}
          selectedGif={selectedGif}
          isLoading={isLoading}
          handleSendGif={handleSendGif}
        />
      )}
       {selectedLocation && (
          <MediaLocationDialog
            isOpen={selectedLocation !== null}
            onClose={() => setSelectedLocation(null)}
            selectedLocation={selectedLocation}
            isLoading={isLoading}
            handleSendLocation={handleSendLocation}
          />
        )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Plus className="text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-gray-tertiary dark:bg-gray-tertiary" sideOffset={10} >
          <DropdownMenuItem onClick={() => imageInput.current!.click()}>
            <ImageIcon size={18} className="mr-1" /> Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => videoInput.current!.click()}>
            <Video size={20} className="mr-1" />
            Video
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => docsInput.current!.click()}>
            <FilesIcon size={20} className="mr-1" />
            Docs
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => audioInput.current!.click()}>
            <FileAudioIcon size={20} className="mr-1" />
            Audio
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => gifInput.current!.click()}>
            <DramaIcon size={20} className="mr-1" />
            GIF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGetLocation}>
          <MapPinIcon size={18} className="mr-1" />
            Location
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MediaDropDown;

type MediaImageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: File;
  isLoading: boolean;
  handleSendImage: () => void;
};

const MediaImageDialog = ({
  isOpen,
  onClose,
  selectedImage,
  isLoading,
  handleSendImage,
}: MediaImageDialogProps) => {
  const [renderedImage, setRenderedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>
          <DialogDescription className="flex flex-col gap-10 justify-center items-center">
            {renderedImage && (
              <Image
                src={renderedImage}
                width={300}
                height={300}
                alt="selected image"
              />
            )}
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={handleSendImage}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </DialogDescription>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

type MediaVideoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: File;
  isLoading: boolean;
  handleSendVideo: () => void;
};

const MediaVideoDialog = ({
  isOpen,
  onClose,
  selectedVideo,
  isLoading,
  handleSendVideo,
}: MediaVideoDialogProps) => {
  const renderedVideo = URL.createObjectURL(
    new Blob([selectedVideo], { type: "video/mp4" })
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>
          <DialogDescription>Video</DialogDescription>
        </DialogTitle>
        <div className="w-full">
          {renderedVideo && (
            <ReactPlayer url={renderedVideo} controls width="100%" />
          )}
        </div>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleSendVideo}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

type MediaDocsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDocs: File;
  isLoading: boolean;
  handleSendDocs: () => void;
};

const MediaDocsDialog = ({
  isOpen,
  onClose,
  selectedDocs,
  isLoading,
  handleSendDocs,
}: MediaDocsDialogProps) => {
  const [renderedDocs, setRenderedDocs] = useState<string | null>(null);
  const [docxContent] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDocs) return;

    const fileType = selectedDocs.type;
    if (fileType === "application/pdf") {
      // Render PDF
      const reader = new FileReader();
      reader.onload = (e) => setRenderedDocs(e.target?.result as string);
      reader.readAsDataURL(selectedDocs);
    } else if (fileType === "application/docx") {
      // Render DOCX
      const reader = new FileReader();
      reader.onload = (e) => setRenderedDocs(e.target?.result as string);
      reader.readAsDataURL(selectedDocs);
    } else {
      setRenderedDocs(null); // Reset if unsupported file type
    }
  }, [selectedDocs]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>
          <DialogDescription className="flex flex-col gap-10 justify-center items-center">
            {selectedDocs.type === "application/pdf" && renderedDocs && (
              <iframe
                src={renderedDocs}
                width="100%"
                height="500"
                title="PDF Preview"
              />
            )}
            {selectedDocs.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
              docxContent && (
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {docxContent}
                </div>
              )}
            {!renderedDocs && !docxContent && (
              <span className="text-gray-500">
                Unsupported file type or no file selected.
              </span>
            )}
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={handleSendDocs}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </DialogDescription>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

type MediaAudioDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedAudio: File;
  isLoading: boolean;
  handleSendAudio: () => void;
};
const MediaAudioDialog = ({
  isOpen,
  onClose,
  selectedAudio,
  isLoading,
  handleSendAudio,
}: MediaAudioDialogProps) => {
  const [renderedAudio, setRenderedAudio] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAudio) return;
    const reader = new FileReader();
    reader.onload = (e) => setRenderedAudio(e.target?.result as string);
    reader.readAsDataURL(selectedAudio);
  }, [selectedAudio]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>
          <DialogDescription className="flex flex-col gap-10 justify-center items-center">
            {renderedAudio && (
              <audio controls>
                <source src={renderedAudio} type={selectedAudio!.type} />
              </audio>
            )}
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={handleSendAudio}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </DialogDescription>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};
type MediaGifDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedGif: File;
  isLoading: boolean;
  handleSendGif: () => void;
};
const MediaGifDialog = ({
  isOpen,
  onClose,
  selectedGif,
  isLoading,
  handleSendGif,
}: MediaGifDialogProps) => {
  const [renderedGif, setRenderedGif] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGif) return;
    const reader = new FileReader();
    reader.onload = (e) => setRenderedGif(e.target?.result as string);
    reader.readAsDataURL(selectedGif);
  }, [selectedGif]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>
          <DialogDescription className="flex flex-col gap-10 justify-center items-center">
            {renderedGif && (
              <Image
                src={renderedGif}
                width={300}
                height={300}
                alt="selected gif"
              />
            )}
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={handleSendGif}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </DialogDescription>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};
type MediaLocationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: any;
  isLoading: boolean;
  handleSendLocation: () => void;
};

const MediaLocationDialog = ({
  isOpen,
  onClose,
  selectedLocation,
  isLoading,
  handleSendLocation,
}: MediaLocationDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>
          <DialogDescription className="flex flex-col gap-10 justify-center items-center">
            <span>
              Latitude: {selectedLocation.latitude}, Longitude: {selectedLocation.longitude}
            </span>
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={handleSendLocation}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </DialogDescription>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};
