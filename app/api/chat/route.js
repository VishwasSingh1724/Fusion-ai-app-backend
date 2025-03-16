import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SaveChat from "@/app/actions/save.action";

// Define allowed origins
const allowedOrigins = ["http://localhost:3000", "*"];

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  // Handle CORS manually
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "CORS policy does not allow this origin" }, { status: 403 });
  }

  try {
    const reqBody = await req.json();
    const { userPrompt ,chatName} = reqBody;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { maxOutputTokens: 200 },
    });
    console.log(userPrompt,chatName)
    
    const prompt = userPrompt + " Respond in a well-described and concise manner containing words between 20 to 30.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const type = "chat"
      
    SaveChat({chatName:chatName,userMessage:userPrompt,type:"chat",AiResponse:text})
    
    // Construct response with CORS headers
    return new NextResponse(
      JSON.stringify({ text,type }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle CORS preflight request
export function OPTIONS(req) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
