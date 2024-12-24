import { uploadFile } from "@/lib/upload";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const url = await uploadFile(file);
  return new NextResponse(JSON.stringify(url), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
