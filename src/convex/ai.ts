"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ExtractedCard {
  content: string;
  type: "decision" | "action" | "question";
}

export const extractMeetingNotes = action({
  args: { notes: v.string() },
  handler: async (ctx, args): Promise<ExtractedCard[]> => {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that extracts and categorizes meeting notes. Analyze the provided meeting notes and extract:
- DECISIONS: Final choices, agreements, or conclusions made
- ACTIONS: Tasks, todos, or action items with owners/deadlines
- QUESTIONS: Open questions, uncertainties, or items needing clarification

Return a JSON array of objects with "content" (the extracted text) and "type" (either "decision", "action", or "question").
Only extract meaningful items, skip headers, attendee lists, and short/irrelevant lines.`
          },
          {
            role: "user",
            content: args.notes
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);
    
    // Handle different possible response formats
    const items = parsed.items || parsed.cards || parsed.results || [];
    
    return items.map((item: any, index: number) => ({
      id: `card-${index}`,
      content: item.content || item.text || "",
      type: item.type || "question"
    }));
  },
});
