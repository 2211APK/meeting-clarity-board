import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const send = mutation({
  args: {
    content: v.string(),
    usageType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userName = user.name || user.email || "Anonymous";

    await ctx.db.insert("messages", {
      userId,
      userName,
      content: args.content,
      usageType: args.usageType,
    });
  },
});

export const list = query({
  args: {
    usageType: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_usage_type", (q) => q.eq("usageType", args.usageType))
      .order("desc")
      .take(100);

    return messages.reverse();
  },
});
