import AddFriendButton from '@/app/components/AddFriendButton'
import { FC } from 'react'



const page: FC = ({}) => {
  return <main>
    <h1 className='font-bold text-5xl mb-8'>
        Add a friend
    </h1>
    <AddFriendButton/>
  </main>
}

export default page