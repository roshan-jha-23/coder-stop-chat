import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/redis.";
import { getServerSession } from "next-auth";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_request`,
      idToAdd
    );
    if(!hasFriendRequest){
      return new Response('No friend Request ',{status:400})
    }
    await db.sadd(`user:${session.user.id}:friend`, idToAdd);
    await db.sadd(`user:${idToAdd}:friend`, session.user.id);
    await db.srem(`user:${idToAdd}:incoming_friend_request`, session.user.id);
    await db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd);
    return new Response('Your Freind has been sent',{status:200})
  } catch (error) {
       if(error instanceof z.ZodArray){
        return new Response(`Invalid request Payload`,{status:422})
       }
       return new Response('invalid request',{status:400})
  }
}
