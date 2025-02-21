"use client";
import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch";
// import { conversations } from "@/dummy-data/db";
import Conversation from "./conversation";
import { SignIn, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useConversationStore } from "@/store/chat-store";

const LeftPanel = () => {
	
	const {isAuthenticated,isLoading} = useConvexAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const conversations =  useQuery(api.conversations.getMyConversations,
		isAuthenticated? undefined : "skip"
	);
	const filteredConversations = conversations?.filter((conversation) => {
		const conversationName = conversation.groupName || (conversation as any).name;
		return conversationName.toLowerCase().includes(searchTerm.toLowerCase());
	});
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const searchInput = e.currentTarget as HTMLFormElement;
		const searchValue = (searchInput.elements.namedItem("search") as HTMLInputElement).value;
		setSearchTerm(searchValue);
	};
	const { selectedConversation, setSelectedConversation } = useConversationStore();

	useEffect(() => {
		const conversationIds = conversations?.map((conversation) => conversation._id);
		if (selectedConversation && conversationIds && !conversationIds.includes(selectedConversation._id)) {
			setSelectedConversation(null);
		}
	}, [conversations, selectedConversation, setSelectedConversation]);

	if (isLoading) return null;
	return (
		<span className='w-1/4 border-gray-600 border-r'>
			<span className='sticky top-0 bg-left-panel z-10'>
				<span className='flex justify-between bg-gray-primary p-3 items-center'>
					<UserButton/>

					<span className='flex items-center gap-3'>
						{isAuthenticated && <UserListDialog/>}
						<ThemeSwitch />
					</span>
				</span>
				<span className='p-3 flex items-center'>
					{/* Search */}
					<span className='relative h-10 mx-3 flex-1'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'
							size={18}
						/>
						{/* <Input
							type='text'
							placeholder='Search or start a new chat'
							className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
						/> */}
						<form onSubmit={handleSearch}>
							<Input
								type="text"
								name="search"
								placeholder="Search or start a new chat"
								className="pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</form>
					</span>
				</span>
			</span>
			<span className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
				{/* Conversations will go here*/}
                {filteredConversations?.map((conversations)=>(
                    <Conversation key={conversations._id} conversation={conversations} />
                ))}
				{filteredConversations?.length === 0 && (
					<>
						<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
						<p className='text-center text-gray-500 text-sm mt-3 '>
							We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
						</p>
					</>
				)}
			</span>
		</span>
	);
};
export default LeftPanel;