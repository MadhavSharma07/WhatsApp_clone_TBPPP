export const conversations = [
	{
		_id: "1",
		admin: "amar",
		groupImage: null,
		groupName: "amar",
		participants: ["amar", "user2", "user3"],
		_creationTime: 1638232272, // Unix timestamp for 2021-11-30 12:04:32 UTC
		lastMessage: {
			_id: "1",
			messageType: "text",
			content: "Hello everyone!",
			sender: "amar",
		},
		sender: "amar",
		isOnline: true,
	},
	{
		_id: "2",
		admin: "pushpak",
		groupImage: "https://avatars.githubusercontent.com/u/75279146?v=4",
		groupName: "pushpak",
		participants: ["user4", "user5"],
		_creationTime: 1638235872, // Unix timestamp for 2021-11-30 13:04:32 UTC
		lastMessage: {
			_id: "2",
			messageType: "text",
			content: "Hey there!",
			sender: "user2",
		},
		sender: "user4",
		isOnline: true,
	},
	{
		_id: "3",
		admin: "madhav",
		groupImage: null,
		groupName: "madhav",
		participants: ["user6", "user7"],
		_creationTime: 1638239472, // Unix timestamp for 2021-11-30 14:04:32 UTC
		lastMessage: {
			_id: "3",
			messageType: "image",
			content: "image_url.jpg",
			sender: "user6",
		},
		sender: "user6",
		isOnline: false,
	},
	{
		_id: "4",
		admin: "aditya",
		groupImage:null,
		groupName: "aditya",
		participants: ["user8", "user9", "amar0"],
		_creationTime: 1638243072, // Unix timestamp for 2021-11-30 15:04:32 UTC
		lastMessage: {
			_id: "4",
			messageType: "video",
			content: "video_url.mp4",
			sender: "user9",
		},
		sender: "user9",
		isOnline: false,
	},
];

export const messages = [
	{
		_id: "1",
		content: "Hello everyone!",
		sender: "amar",
		messageType: "text",
	},
	{
		_id: "2",
		content: "Hey there!",
		sender: "user2",
		messageType: "text",
	},
	{
		_id: "3",
		content: "How's it going!?",
		sender: "amar",
		messageType: "text",
	},
	{
		_id: "4",
		content: "Fine, thanks!",
		sender: "user2",
		messageType: "text",
	},
];

export const users = [
	{
		_id: "amar",
		name: "amar",
		email: "johndoe@email.com",
		image: "https://randomuser.me/api/portraits/men/67.jpg",
		admin: true,
		isOnline: true,
	},
	{
		_id: "user2",
		name: "madhav",
		email: "janedoe@email.com",
		image: "https://randomuser.me/api/portraits/men/6.jpg",
		isOnline: true,
		admin:true,
	},
	{
		_id: "user3",
		name: "pushpak",
		email: "alice@email.com",
		image: "https://randomuser.me/api/portraits/men/68.jpg",
		isOnline: false,
	},
	{
		_id: "user4",
		name: "aditya",
		email: "alice@email.com",
		image: "https://randomuser.me/api/portraits/men/7.jpg",
		isOnline: false,
	},
];