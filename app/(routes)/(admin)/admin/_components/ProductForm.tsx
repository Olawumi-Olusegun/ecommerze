"use client";

import React, { FC, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import { Textarea } from "@/components/ui/textarea"
import { addProduct, updateProduct } from '../_actions/products';
import SubmitButton from './SubmitButton';
import { useFormState } from 'react-dom';
import { Product } from '@prisma/client';
import Image from 'next/image';

type ProductFormProps = {
    product?: Product | null;
}

const ProductForm: FC<ProductFormProps> = ({product}) => {

    const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id) , {});

    const [priceInCents, setPriceInCents] = useState(Number(product?.priceInCents) || 0);

  return (
    <>
    <form action={action} className='space-y-8'>
        <div className='space-y-2'>
            <Label htmlFor='name'>Name:</Label>
            <Input type='text' defaultValue={product?.name || ""} name='name' id='name' placeholder='Product' required />
            {error.name ? <span className='text-destructive'>{error.name}</span> : null }
        </div>

        <div className='space-y-2'>
            <Label htmlFor='priceInCents'>Price:</Label>
            <Input 
            type='text' 
            value={priceInCents}
            onChange={(event) => setPriceInCents(Number(event.target.value) || 0)} 
            name='priceInCents' 
            id='priceInCents' 
            placeholder='Price' 
            required 
            />
            <div className="text-muted-foreground">
                {formatCurrency((priceInCents || 0) / 100)}
            </div>
            {error.priceInCents ? <span className='text-destructive'>{error.priceInCents}</span> : null }
        </div>

        <div className='space-y-2'>
            <Label htmlFor='description'>Description:</Label>
            <Textarea name='description' id='description'  defaultValue={product?.description || ""} placeholder='Description' required className='resize-none' />
            {error.description ? <span className='text-destructive'>{error.description}</span> : null }
        </div>

        <div className='space-y-2'>
            <Label htmlFor='file'>File:</Label>
            <Input type='file' name='file' id='file' required={ product == null} />
            { product != null 
            ? (
                <div className="text-muted-foreground">{product.filePath}</div>
            ) 
            : null }
            {error.file ? <span className='text-destructive'>{error.file}</span> : null }
        </div>

        <div className='space-y-2'>
            <Label htmlFor='image'>Image:</Label>
            <Input type='file' name='image' id='image' required={ product == null} />
            { product != null 
            ? (
                <Image src={product.imagePath} alt={product.name} width={400} height={400} />
            ) 
            : null }
            {error.image ? <span className='text-destructive'>{error.image}</span> : null }
        </div>

        <SubmitButton />

    </form>
    </>
  )
}

export default ProductForm