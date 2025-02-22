import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addStatus = mutation({
  args: { userId: v.id("users"), content: v.string(), type: v.union(v.literal("text"), v.literal("image"), v.literal("video")) },
  handler: async (ctx, { userId, content, type }) => {
    const createdAt = Date.now();
    const expiresAt = createdAt + 24 * 60 * 60 * 1000; // Expires in 24 hours
    await ctx.db.insert("statuses", { userId, content, type, createdAt, expiresAt });
  },
});

export const getStatuses = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("statuses")
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .collect();
  },
});
