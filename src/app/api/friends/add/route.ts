import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validatons/add-friend"
import { getServerSession } from "next-auth"
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { email : emailToAdd } = addFriendValidator.parse(body.email)

        const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            cache : 'no-store',
        }) 
        const data = await RESTResponse.json() as {result : string}

        const IdToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string
        if(!IdToAdd){
            return new Response('This person does not exist', {status : 400})
        }
        const session = await getServerSession(authOptions)
        
                if(!session){
                    return new Response('unauthorized', {status : 401})
                }

        if(IdToAdd === session?.user.id) {
            return new Response('You can not add your sefl as a friend', { status : 400 })
        }
// check is user is added
const isAlreadyAdded = (await fetchRedis('sismember', `user:${IdToAdd}:incoming_friend_requests`, session.user.id)) as 0 | 1

if(isAlreadyAdded){
    return new Response('Already added this user', { status: 400 })
}
// check if user is already friend
const isAlreadyFriends = (await fetchRedis('sismember', `user:${session.user.id}:friends`, IdToAdd)) as 0 | 1

if(isAlreadyFriends){
    return new Response('Already a friend of this user', { status: 400 })
}

// validate , send friend request
db.sadd(`user:${IdToAdd}:incoming_friend_requests`, session.user.id)

return new Response('OK')

        console.log(data)
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid request payload' , { status: 422 })
        }

        return new Response('Invalid request', { status : 400})
    }
}