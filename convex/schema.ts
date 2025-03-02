import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.optional(v.string()),
		email: v.string(),
		image: v.string(),
		tokenIdentifier: v.string(),
		isOnline: v.boolean(),
	}).index("by_tokenIdentifier", ["tokenIdentifier"]),

	conversations: defineTable({
		participants: v.array(v.id("users")),
		isGroup: v.boolean(),
		groupName: v.optional(v.string()),
		groupImage: v.optional(v.string()),
		admin: v.optional(v.id("users")),
	}),

	messages: defineTable({
		conversation: v.id("conversations"),
		sender: v.string(), // should be string so that it doesn't throw errors in openai part ("ChatGPT")
		content: v.string(),
		messageType: v.union(v.literal("text"), v.literal("image"), v.literal("video"),v.literal("docs"),v.literal("audio"),v.literal("gifs"),v.literal("location")),
	}).index("by_conversation", ["conversation"]),

	statuses: defineTable({
		userId: v.id("users"),
		content: v.string(), 
		type: v.union(v.literal("text"), v.literal("image"), v.literal("video")),
		createdAt: v.number(), 
		expiresAt: v.number(), 
	  }),
	  reactions: defineTable({
		statusId: v.id("statuses"),
		type: v.union(v.literal("like"), v.literal("love"), v.literal("laugh"), v.literal("sad")),
	  }),
});