import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    // Build a strong prompt that forces model to ONLY use provided technologies
    const prompt = `
      You are an intelligent AI interview question generator.

      Create EXACTLY ${amount} interview questions.

      CANDIDATE DETAILS:
      - ROLE: ${role}
      - EXPERIENCE LEVEL: ${level}
      - TECH STACK: ${techstack}
      - INTERVIEW TYPE: ${type} (Technical / Behavioral / Mixed)

      RULES:
      ❗ ONLY generate questions based on technologies provided in TECH STACK.
      ❗ DO NOT assume Next.js, React, Java, Python, SQL, or anything else
         unless it is explicitly mentioned by the user.
      ❗ If multiple skills are provided, mix them properly.

      FORMAT STRICTLY AS A PURE JSON ARRAY:
      ["Question 1", "Question 2", "Question 3"]

      NO markdown, NO extra text, NO labels, NO explanations.
    `;

    const { text: aiResponse } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    // Safely parse the AI output
    let questions: string[] = [];
    try {
      questions = JSON.parse(aiResponse);
    } catch (err) {
      console.error("JSON parse error:", err);
      return Response.json(
        {
          success: false,
          error: "Model returned invalid JSON. Check prompt formatting.",
        },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error generating interview:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, message: "API working" });
}
