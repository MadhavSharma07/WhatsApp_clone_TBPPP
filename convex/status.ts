import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addStatus = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("video")),
  },
  handler: async (ctx, args) => {
    const createdAt = Date.now();
    const expiresAt = createdAt + 24 * 60 * 60 * 1000; // expires in 24 hours
    await ctx.db.insert("statuses", {
      userId: args.userId,
      content: args.content,
      type: args.type,
      createdAt,
      expiresAt,
    });
  },
});

export const getStatuses = query({
  args: {},
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db
      .query("statuses")
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .collect();
  },
});

export const addReaction = mutation({
  args: {
    statusId: v.id("statuses"),
    type: v.union(v.literal("like"), v.literal("love"), v.literal("laugh"), v.literal("sad")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reactions", {
      statusId: args.statusId,
      type: args.type,
    });
  },
});

export const getReactions = query({
  args: {
    statusId: v.id("statuses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reactions")
      .filter((q) => q.eq(q.field("statusId"), args.statusId))
      .collect();
  },
});