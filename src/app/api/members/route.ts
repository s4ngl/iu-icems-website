import { NextResponse } from "next/server";
import { getAllMembers } from "@/services/memberService";

export async function GET() {
  try {
    const members = await getAllMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
