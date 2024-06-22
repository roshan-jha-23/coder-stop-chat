'use client'
import FriendRequests from '@/app/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'



const page: FC =async ({}) => {
    const session=await getServerSession(authOptions)
    if(!session)notFound()

        //ids of the people who sent the friend req
        const incomingSenderId=(await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`)) as string[]
        const incomingFriendRequest = await Promise.all(
          incomingSenderId.map(async (senderId) => {
            const sender = (await fetchRedis(
              "get",
              `user:${senderId}`
            )) as string;
            const senderParsed = JSON.parse(sender) as User;
            return {
              senderId,
              senderName: senderParsed.name,
            };
          })
        );
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequest={incomingFriendRequest}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
}

export default page