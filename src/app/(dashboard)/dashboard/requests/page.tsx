import AddFriendButton from '@/components/AddFriendButton'
import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { User } from '@/types/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import {FC} from 'react'



const page = async () => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()

    // ids of people who sent us a friend request
    const incomingSenderIDs = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_request`)) as string[]

    const incomingFriendRequest = await Promise.all(
        incomingSenderIDs.map(async (senderID) => {
            const sender =  await fetchRedis('get', `user:${senderID}`) as User
            return {
                senderID,
                senderEmail: sender.email
            }
        })
    )
  return (
    <main className='pt-8'>
        <h1 className="font-bold text-5xl mb">Friends </h1>
        <div className="flex flex-col gap-4">
            <FriendRequests incomingFriendRequests={incomingFriendRequest} sessionID={session.user.id}/>
        </div>
    </main>
  )
}

export default page