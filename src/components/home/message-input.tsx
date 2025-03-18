import { Laugh, Mic, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { useConversationStore } from "@/store/chat-store";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, {Theme} from 'emoji-picker-react';
import MediaDropDown from "./media-dropdown";

const MessageInput = () => {
	const [msgText, setMsgText] = useState("");
	const sendTextMsg = useMutation(api.messages.sendTextMessage)
	const me = useQuery(api.users.getMe)
	const {selectedConversation} = useConversationStore();

	const {ref,isComponentVisible,setIsComponentVisible} = useComponentVisible(false);

	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const sendAudio = useMutation(api.messages.sendAudio);
	const generateUploadUrl = useMutation(api.conversations._generateUploadUrl);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
	const handleSendtextMsg = async(e:React.FormEvent)=>{
		e.preventDefault();
		try{
			await sendTextMsg({content : msgText, conversation : selectedConversation!._id, sender:me!._id});
			setMsgText("");
		}
		catch(err:any){
			toast.error(err.message);
			console.log(err);
			
		}
	}
	const handleMicClick = async () => {
		if (!isRecording) {
		  try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			setStream(stream);
			const mediaRecorder = new MediaRecorder(stream);
			setMediaRecorder(mediaRecorder);
			setIsRecording(true);
		  } catch (error) {
			console.error('Error accessing microphone:', error);
		  }
		} else {
		  mediaRecorder?.stop();
		  setIsRecording(false);
		}
	  };
	
	  useEffect(() => {
		if (isRecording && mediaRecorder) {
		  const audioChunks: Blob[] = [];
	
		  mediaRecorder.ondataavailable = (event) => {
			audioChunks.push(event.data);
		  };
	
		  mediaRecorder.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
			setAudioBlob(audioBlob);
			handleSendAudio();
		  };
	
		  mediaRecorder.start();
		}
	  }, [isRecording, mediaRecorder]);
	
	  const handleSendAudio = async () => {
		if (audioBlob) {
		  try {
			const postUrl = await generateUploadUrl();
			const result = await fetch(postUrl, {
			  method: "POST",
			  headers: { "Content-Type": audioBlob.type },
			  body: audioBlob,
			});
	
			const { storageId } = await result.json();
			 sendAudio({
			  conversation: selectedConversation!._id,
			  sender: me!._id,
			  audioId: storageId,
			});
		  } catch (error) {
			console.error('Error sending audio:', error);
		  }
		}
	  };

	return (
		<div className='bg-gray-primary p-2 flex gap-4 items-center'>
			<div className='relative flex gap-2 ml-2'>
				{/* EMOJI PICKER WILL GO HERE */}
				<div ref ={ref} onClick={()=>setIsComponentVisible(true)}>
					{isComponentVisible && (
						<EmojiPicker
						theme={Theme.DARK}
						onEmojiClick={(emojiObject)=>{
							setMsgText((prev)=>prev+ emojiObject.emoji);
						}}
						style={{position: "absolute", bottom: "1.5rem", left:"1rem" , zIndex: 50 }}
						/>
					)}
					<Laugh className='text-gray-600 dark:text-gray-400' />
				</div>
				<MediaDropDown/>
			</div>
			<form onSubmit={handleSendtextMsg} className='w-full flex gap-3'>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='Type a message'
						className='py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent'
						value={msgText}
						onChange={(e) => setMsgText(e.target.value)}
					/>
				</div>
				<div className='mr-4 flex items-center gap-3'>
					{msgText.length > 0 ? (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
							<Send />
						</Button>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<Mic size={20} onClick={handleMicClick} className={isRecording ? 'text-red-500' : 'text-grey-900'} />
							<p style={{ fontSize: 12, color: 'gray', marginTop: 5 }}>
								{isRecording ? (
								'Recording...'
								) : (
									null
								)}
							</p>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};
export default MessageInput;