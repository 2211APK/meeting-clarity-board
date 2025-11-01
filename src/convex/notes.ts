import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    cards: v.array(
      v.object({
        id: v.string(),
        content: v.string(),
        type: v.union(v.literal("decision"), v.literal("action"), v.literal("question")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const noteId = await ctx.db.insert("notes", {
      userId,
      title: args.title,
      content: args.content,
      cards: args.cards,
    });

    return noteId;
  },
});

export const getUserNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return notes;
  },
});

export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== userId) {
      throw new Error("Note not found or unauthorized");
    }

    await ctx.db.delete(args.noteId);
  },
});
