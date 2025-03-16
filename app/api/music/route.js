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

  const { musicPrompt , chatName} = await req.json();
  const MUSICFY_API = process.env.MUSICFY_API_KEY;

  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MUSICFY_API}`
      },
      body: JSON.stringify({
        prompt: musicPrompt
      })
    };
    
    const response = await fetch('https://api.musicfy.lol/v1/generate-music', options);
    const data = await response.json();

    // Extract the file_url from the response
    const fileUrl = data[0]?.file_url;
    const type ="music"
      SaveChat({chatName:chatName,userMessage:musicPrompt,type:"music",AiResponse:text})
    // Return the file_url as text in the response
    return new NextResponse(
      JSON.stringify({ text: fileUrl ,type}),
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
