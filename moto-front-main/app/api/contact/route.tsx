import { getEmailClient } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resend = getEmailClient();

    const { error } = await resend.emails.send({
      from: "NakenMoto <web@nakenmoto.se>",
      to: ["hello@nakenmoto.se"],
      subject: "Contact - NakenMoto.se",
      html: `
        <p>Subject: ${body.subject}</p>
        <p>From: ${body.name}</p>
        <p>Email: ${body.email}</p>
        <p>Message: ${body.message}</p>
      `,
    });

    if (error) {
      console.error(error);
      return new NextResponse("Email not sent!", {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new NextResponse("Email sent!", {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Email not sent!", {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
