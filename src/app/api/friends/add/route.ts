import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/redis.";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";

import { z } from "zod";

export async function POST(req: Request) {
  console.log("1")
  try {
    const body = await req.json();
console.log("2");
    const { email: emailToAdd } = addFriendValidator.parse(body);
console.log("benchod");
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = (await RESTResponse.json()) as { result: string | null };
    const isToAdd = data.result;
console.log("3");
    if (!isToAdd) {
      return new Response("The person does not exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (isToAdd === session.user.id) {
      return new Response("You can't add yourself as a friend", {
        status: 400,
      });
    }


    const isAlreadyAdded = await fetchRedis(
      "sismember",
      `user:${isToAdd}:incoming_friend_requests`,
      session.user.id
    );

    if (isAlreadyAdded) {
      return new Response("User is already added", { status: 400 });
    }

    // Check if already friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      isToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 });
    }

    // Valid request, send friend request
    await db.sadd(`user:${isToAdd}:incoming_friend_requests`, session.user.id);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Some error occurred while adding", { status: 400 });
  }
}
