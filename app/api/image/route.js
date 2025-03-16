import SaveChat from '@/app/actions/save.action';
import { NextResponse } from 'next/server';

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
    const {imagePrompt,chatName} = await req.json();
   
         const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?nologo=true&enhance=${true}&height=${750}&width=${750}`
         const url = await fetch(imageUrl)
         const text = url.url
         const type = "image"
           SaveChat({chatName:chatName,userMessage:imagePrompt,type:"image",AiResponse:text})
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