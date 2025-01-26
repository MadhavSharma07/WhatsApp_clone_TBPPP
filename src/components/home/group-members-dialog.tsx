// import { users } from "@/dummy-data/db";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown } from "lucide-react";
import { Conversation } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


type GroupMembersDialogProps = {
	selectedConversation:Conversation;
} 

const GroupMembersDialog = ({selectedConversation}:GroupMembersDialogProps) => {
	const users = useQuery(api.users.getGroupMembers,{conversationId: selectedConversation._id});
	return (
		<Dialog>
			<DialogTrigger>
				<p className='text-xs text-muted-foreground text-left'>See members</p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='my-2'>Current Members</DialogTitle>
					<DialogDescription>
						<span className='flex flex-col gap-3 '>
							{users?.map((user) => (
								<span key={user._id} className={`flex gap-3 items-center p-2 rounded`}>
									<Avatar className='overflow-visible'>
										{user.isOnline && (
											<span className='absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground' />
										)}
										<AvatarImage src={user.image} className='rounded-full object-cover' />
										<AvatarFallback>
											<span className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></span>
										</AvatarFallback>
									</Avatar>

									<span className='w-full '>
										<span className='flex items-center gap-2'>
											<span className='text-md font-medium'>
												{user.name || user.email.split("@")[0]}
											</span>
											{user._id===selectedConversation.admin && <Crown size={16} className='text-yellow-400' />}
										</span>
									</span>
								</span>
							))}
						</span>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
export default GroupMembersDialog;