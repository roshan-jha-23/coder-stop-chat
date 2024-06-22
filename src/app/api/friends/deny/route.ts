import { authOptions } from "@/lib/auth";
import { db } from "@/lib/redis.";
import { getServerSession } from "next-auth";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(
        "You are Not Unauthorized buddy try logging in first",
        { status: 402 }
      );
    }
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
    await db.srem(`user:${session.user.id}:incoming_friend_request`, idToDeny);
    return new Response("ok you have removed", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodArray) {
      return new Response(`Invalid request Payload`, { status: 422 });
    }
    return new Response("invalid request", { status: 400 });
  }
}
