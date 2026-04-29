import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

export async function GET() {
  try {
    const data = await supabaseFetch("contacts?select=*&order=created_at.desc", {
      method: "GET",
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into Supabase 'contacts' table
    await supabaseFetch("contacts", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transmit payload" },
      { status: 500 }
    );
  }
}
