import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, FC } from 'react'


export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        small: "px-2 py-1",
        medium: "px-4 py-2",
        large: "px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants>{
  isLoading? : boolean

}

const Button: FC<ButtonProps> = ({className,children,variant,isLoading,size,...props}) => {
  return <button className={cn(buttonVariants({variant,size,className}))} disabled={isLoading} {...props}>
    {isLoading ?<Loader2 className='mr-2 h-4 w-4 animate-spin'/>:null}
    {children}
  </button>
}

export default Button