import FriendRequests from "@/app/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface IncomingFriendRequest {
  senderId: string;
  senderEmail: string | null | undefined;
  senderName: string | null | undefined;
}

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // ids of people who sent current logged in user a friend request
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as {
        email: string;
        name: string;
      };

      return {
        senderId,
        senderEmail: senderParsed.email,
        senderName: senderParsed.name,
      };
    })
  );

  return (
    <main className="pt-8 bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-5xl mb-8 text-white">Add a friend</h1>
        <div className="flex flex-col gap-4">
          <FriendRequests
            incomingFriendRequests={incomingFriendRequests}
            sessionId={session.user.id}
          />
        </div>
      </div>
    </main>
  );
};

export default page;
