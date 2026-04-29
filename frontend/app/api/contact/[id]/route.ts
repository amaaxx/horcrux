import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await supabaseFetch(`contacts?id=eq.${id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to purge record" },
      { status: 500 }
    );
  }
}
