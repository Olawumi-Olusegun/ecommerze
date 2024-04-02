import React, { type FC } from 'react'
import PageHeader from '../../../_components/PageHeader'
import ProductForm from '../../../_components/ProductForm'
import prismaDb from '@/app/db/prismaDb'
import { redirect } from 'next/navigation'

type EditProductPageProps = {
    params: {
        productId: string;
    }
}

const EditProductPage: FC<EditProductPageProps> = async ({ params }) => {

    if(!params.productId) {
        return redirect("/admin/products");
    }

    const product = await prismaDb.product.findUnique({ where: { id: params.productId } });

    if(!product?.id) {
        return redirect("/admin/products");
    }


  return (
    <>
        <PageHeader>Edit Product</PageHeader>
        <ProductForm product={product} />
    </>
  )
}

export default EditProductPage