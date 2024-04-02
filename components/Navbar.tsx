"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ComponentProps, FC, type PropsWithChildren } from 'react'

type NavbarProps = PropsWithChildren;

type NavLinkProps = Omit<ComponentProps<typeof Link>, "className">;

export const Navbar: FC<NavbarProps> = ({children}) => {
  return (
    <nav className='bg-primary text-primary-foreground flex  items-center justify-between gap-2 px-4 w-full'>
        {children}
    </nav>
  )
}

export const NavLink:FC<NavLinkProps> = (props) => {
    const pathname = usePathname();
    return <Link 
    className={cn("p-3 transition-colors text-sm duration-300 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground", 
     pathname === props.href ? "bg-background text-foreground transition-colors duration-150" : ""
    )} {...props}  />
}


