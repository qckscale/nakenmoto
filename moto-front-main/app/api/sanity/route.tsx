import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await Promise.all(
      body.requests?.map((request: any) =>
        client.fetch(request.query, request.params || {}, request.config)
      )
    );
    return new NextResponse(data as any, {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Request failed!", {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
