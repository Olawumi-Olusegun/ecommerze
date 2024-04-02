"use server";

import prismaDb from '@/app/db/prismaDb';
import { z } from 'zod';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';




const fileSchema = z.instanceof(File, { message: "Required"});

const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith("image/"))

const addProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required"),
});

const editProductSchema = addProductSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional(),
});

export const addProduct = async (prevState: unknown, formData: FormData) => {
    
    const result = addProductSchema.safeParse(Object.fromEntries(formData.entries()));

    if(!result.success) {
        return result.error.formErrors.fieldErrors
    }

    const { name, description, priceInCents, file, image } = result.data;

    // upload files to storage
    fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // upload images to storage
    fs.mkdir("public/products", { recursive: true });
    const imagePath = `products/${crypto.randomUUID()}-${image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()));


    prismaDb.product.create({
        data: {
            name,
            description,
            priceInCents: priceInCents.toString(),
            filePath,
            imagePath,
            isAvailableForPurchase: false,
         }
    });

    redirect("/admin/products");
}

export const updateProduct = async (productId: string, prevState: unknown, formData: FormData) => {
    
    const result = editProductSchema.safeParse(Object.fromEntries(formData.entries()));

    if(!result.success) {
        return result.error.formErrors.fieldErrors
    }

    const { name, description, priceInCents, file, image } = result.data;

    const product = await prismaDb.product.findUnique({ where: { id: productId } });

    if(!product) {
        return notFound();
    }

    let filePath = product.filePath;

    if(file != null && file.size > 0) {
    await fs.unlink(`public${product.imagePath}`);
    // upload files to storage
    // fs.mkdir("products", { recursive: true });
    filePath = `products/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    }

    let imagePath = product.filePath;

    if(image != null && image.size > 0) {
    await fs.unlink(product.imagePath);
    // upload images to storage
    // fs.mkdir("public/products", { recursive: true });
    imagePath = `products/${crypto.randomUUID()}-${image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()));

    }

    prismaDb.product.update({
        where: { id: productId },
        data: {
            name,
            description,
            priceInCents: priceInCents.toString(),
            filePath,
            imagePath,
         }
    });

    redirect("/admin/products");
}

export const toggleProductAvailability = async (id: string, isAvailableForPurchase: boolean) => {

    await prismaDb.product.update({
        where: { id },
        data: { isAvailableForPurchase } 
    });


}

export const deleteProduct = async (id: string) => {
   
    const product =  await prismaDb.product.delete({  where: { id }, });
    if(product == null) {
        return notFound();
    }

    await fs.unlink(product.filePath);
    await fs.unlink(`publicproducts/${product.imagePath}`);
}