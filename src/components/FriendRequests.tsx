"use client"
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import React, { FC, useState } from "react";

interface FriendRequestsProps {
    incomingFriendRequests : IncomingFriendRequest[]
    sessionID: string
};

const FriendRequests:FC<FriendRequestsProps> = ({incomingFriendRequests, sessionID}) => {
    const [friendRequest, setFriendRequest] = useState<IncomingFriendRequest[]>(incomingFriendRequests);
    console.log(friendRequest)
    return(
        <>
            {
                friendRequest.length === 0 ? (

                    <p className="text-sm text-zinc-500">Nothing to show here click <Link href="/dashboard/add" className="text-indigo-600 underline underline-offset-2">here</Link> to add more friends </p>
                ) : (
                    friendRequest.map(request => {
                       return (
                         <div className="flex gap-4 items-center" key={request.senderID}>
                            <UserPlus className="text-black"/>
                            <p className="font-medium text-lg">{request.senderEmail}</p>
                            <button aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounder-full transition hover:shadow-md"><Check className='font-semibold text-white w-3/4 h3/4'/></button>
                            <button aria-label="deny friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounder-full transition hover:shadow-md"><X className='font-semibold text-white w-3/4 h3/4'/></button>
                            
                        </div>
                       )
                    })
                )
            }
        </>
    )
};

export default FriendRequests;