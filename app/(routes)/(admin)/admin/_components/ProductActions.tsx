"use client";

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React, { FC, useTransition } from 'react'
import { deleteProduct, toggleProductAvailability } from '../_actions/products';
import { useRouter } from 'next/navigation';


type ActiveToggleDropDownItemProps = {
    id: string;
    isAvailableForPurchade: boolean;
}

type DeleteDropDownItemProps = {
    id: string;
    disabled: boolean;
}

export const ActiveToggleDropDownItem: FC<ActiveToggleDropDownItemProps> = ({ id, isAvailableForPurchade}) => {
 
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

  return (
    <DropdownMenuItem disabled={isPending} onClick={ () => {
        startTransition(async () => {
            await toggleProductAvailability(id, !isAvailableForPurchade);
            router.refresh()
        })
    } } >
        { isAvailableForPurchade ? "Deactivate" : "Activate"  }
    </DropdownMenuItem>
  )
}

export const DeleteDropDownItem: FC<DeleteDropDownItemProps> = ({ id, disabled}) => {
 
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
  return (
    <DropdownMenuItem disabled={ disabled || isPending} onClick={ () => {
        startTransition(async () => {
            await deleteProduct(id);
            router.refresh()
        })
    } } >
        Delete
    </DropdownMenuItem>
  )
}





