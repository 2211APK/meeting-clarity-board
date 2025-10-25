import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const updateUsageType = mutation({
  args: {
    usageType: v.union(v.literal("meetings"), v.literal("school")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, {
      usageType: args.usageType,
    });

    return { success: true };
  },
});
