import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    importance: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    deadline: v.optional(v.number()),
    time: v.optional(v.string()),
    usageType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const taskId = await ctx.db.insert("tasks", {
      userId: identity.subject,
      title: args.title,
      description: args.description,
      importance: args.importance,
      deadline: args.deadline,
      time: args.time,
      completed: false,
      usageType: args.usageType,
      completedAt: undefined,
    });

    return taskId;
  },
});

// List all tasks for the current user
export const list = query({
  args: { usageType: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_usage", (q) =>
        q.eq("userId", identity.subject).eq("usageType", args.usageType)
      )
      .collect();

    // Sort by importance (high -> medium -> low) and then by deadline
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    return tasks.sort((a, b) => {
      const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (importanceDiff !== 0) return importanceDiff;
      
      if (a.deadline && b.deadline) {
        return a.deadline - b.deadline;
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });
  },
});

// Toggle task completion
export const toggle = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== identity.subject) {
      throw new Error("Task not found or unauthorized");
    }

    await ctx.db.patch(args.taskId, {
      completed: !task.completed,
      completedAt: !task.completed ? Date.now() : undefined,
    });
  },
});

// Delete a task
export const remove = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== identity.subject) {
      throw new Error("Task not found or unauthorized");
    }

    await ctx.db.delete(args.taskId);
  },
});

// Update task
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    importance: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    deadline: v.optional(v.number()),
    time: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== identity.subject) {
      throw new Error("Task not found or unauthorized");
    }

    const { taskId, ...updates } = args;
    await ctx.db.patch(taskId, updates);
  },
});

// Get tasks with upcoming deadlines (for reminders)
export const getUpcoming = query({
  args: { usageType: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const now = Date.now();
    const oneHourFromNow = now + 60 * 60 * 1000;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_usage", (q) =>
        q.eq("userId", identity.subject).eq("usageType", args.usageType)
      )
      .filter((q) => q.eq(q.field("completed"), false))
      .collect();

    return tasks.filter(
      (task) => task.deadline && task.deadline > now && task.deadline <= oneHourFromNow
    );
  },
});
