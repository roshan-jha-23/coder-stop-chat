'use client'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './Button'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
    const[isSigningOut,setIsSigningOut]=useState<boolean>(false)

  return <Button {...props} variant='secondary'
  onClick={async()=>{
    setIsSigningOut(true)
    try {
        await signOut()
    } catch (error) {
        toast.error('There was an issue signingOut')
    }finally{
        setIsSigningOut(false);
    }
  }}
  >
    {
        isSigningOut?(<Loader2 size={20} className='animate-spin'/>):(<LogOut size={20}/>)


    }
  </Button>
}

export default SignOutButton