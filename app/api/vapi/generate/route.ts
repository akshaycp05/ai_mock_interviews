import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    // Prompt to generate dynamic questions for ANY technology
    const prompt = `
      You are an intelligent interview generator.

      Create EXACTLY ${amount} interview questions.

      ROLE: ${role}
      EXPERIENCE LEVEL: ${level}
      TECH SKILLS PROVIDED BY CANDIDATE: ${techstack}
      INTERVIEW STYLE: ${type} (Behavioral / Technical / Mixed)

      Only generate questions based on the technology the candidate knows.
      ❗ For example:
      - If techstack includes Python → Ask Python questions
      - If techstack includes HTML → Ask HTML questions
      - If techstack includes Java → Ask Java questions
      - If techstack includes SQL → Ask SQL questions
      - If techstack includes React → Ask React questions
      DO NOT ask irrelevant questions like Next.js unless it is in the techstack.

      FORMAT STRICTLY AS ARRAY:
      ["Question 1", "Question 2", "Question 3"]

      DO NOT include extra text, no explanation, no markdown.
    `;

    const { text: aiResponse } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    // Parse clean response
    const questions = JSON.parse(aiResponse);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()), // FIXED
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
