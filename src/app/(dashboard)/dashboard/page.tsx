import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const chatKey = `chat:${chatHrefConstructor(
        session.user.id,
        friend.id
      )}:messages`;
      const lastMessageRaw = (await fetchRedis(
        "zrange",
        chatKey,
        -1,
        -1
      )) as string[];

      let lastMessage = null;
      if (lastMessageRaw && lastMessageRaw.length > 0) {
        try {
          lastMessage = JSON.parse(lastMessageRaw[0]) as Message;
        } catch (error) {
          console.error("Failed to parse last message:", error);
        }
      }

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <div className="container bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 py-12 text-white">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-gray-300">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border border-purple-700 p-3 rounded-md shadow-lg"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-yellow-400" />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-10 w-10">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full border-2 border-white"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-yellow-300">
                  {friend.name}
                </h4>
                <p className="mt-1 max-w-md">
                  {friend.lastMessage ? (
                    <>
                      <span className="text-yellow-400">
                        {friend.lastMessage.senderId === session.user.id
                          ? "You: "
                          : ""}
                      </span>
                      {friend.lastMessage.text}
                    </>
                  ) : (
                    <span className="text-yellow-400">No messages yet</span>
                  )}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default page;
