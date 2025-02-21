import { messages } from "@/dummy-data/db";
import ChatBubble from "./chat-bubble";
import { useConversationStore } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";

const MessageContainer = () => {

	const { selectedConversation } = useConversationStore();
	const messages = useQuery(api.messages.getMessages, {
		conversation: selectedConversation!._id,
	});
	const me = useQuery(api.users.getMe);
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
			  console.log("Notification permission granted.");
			} else {
			  console.log("Unable to get permission to notify.");
			}
		});
	}, [messages]);
	useEffect(() => {
		if (messages) {
		  const newMessage = messages[messages.length - 1];
		  if (newMessage) {
			if (newMessage.sender._id !== me?._id) {
			const notification=new Notification("New message ",{
				body:`you have a new message from ${newMessage.sender.name}.`,
			});
			const notificationSound = new Audio("./notification.mp3");
				notificationSound.play();
			notification.onclick=()=>{
				console.log("Notification clicked");
			};
			}
		  }
		}
	},[messages]);

	return (
		<div className='relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark'>
			<div className='mx-12 flex flex-col gap-3 h-full'>
				{messages?.map((msg, idx) => (
					<div key={msg._id}>
						<ChatBubble
							message={msg} me={me} previousMessage={idx > 0 ? messages[idx - 1] : undefined}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
export default MessageContainer;