
import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import SaveChat from "@/app/actions/save.action";


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


  // Get the prompt field from the request body
  const reqBody = await req.json();
  const { codePrompt , chatName} = reqBody;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: { maxOutputTokens: 200 },
  });

  try {
    const prompt =codePrompt + "you are a code generator. You must answer only in markdown code snippets. Use comments for explanation" 
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const type = "code"
      SaveChat({chatName:chatName,userMessage:codePrompt,type:"code",AiResponse:text})
    return new NextResponse(
      JSON.stringify({ text , type}),
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
