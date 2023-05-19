
import Button from '@/components/ui/Button';
import { FC } from 'react';
import { getServerSession } from 'next-auth'

const page = async ({}) => {
    const session = await getServerSession()
    return (
        <div>dashboard</div>
    )
}


export default page;