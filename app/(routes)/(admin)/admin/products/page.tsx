
import React from 'react'
import PageHeader from '../_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prismaDb from '@/app/db/prismaDb'
import { CheckCircle2, MoreVertical, X } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ActiveToggleDropDownItem, DeleteDropDownItem } from '../_components/ProductActions'

const AdminProductPage = () => {
  return (
    <>
    <div className="flex justify-between items-center gap-4 pb-4 ">
        <PageHeader className='text-2xl font-semibold'>
            Products
        </PageHeader>
        <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
        </Button>
    </div>
    <ProductTable />
    </>
  )
}

export default AdminProductPage


const ProductTable = async () => {


    const products = await prismaDb.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            filePath: true,
            _count: { select: { orders: true } }
        },
        orderBy: { name: "asc" }
    });

    if(products.length === 0) {
        return <>
         <p className='p-2 text-base'>No product found</p>
        </>
    }

    return <>
     <Table>
        <TableHeader>
            <TableRow>
                <TableHead className='w-0'>
                    <span className="sr-only">Available For Purchase</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className='w-0'>
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.isAvailableForPurchase 
                        ? <>
                         <CheckCircle2 /> 
                         <span className="sr-only">Available</span>
                        </>
                        : <>
                         <X className='stroke-destructive' /> 
                        <span className="sr-only">Unvailable</span>
                        </>  
                        }
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{formatCurrency(Number(product.priceInCents) / 100)}</TableCell>
                        <TableCell>{formatCurrency(Number(product._count.orders))}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a href={`/admin/products/${product.id}/download`} >Download</a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <ActiveToggleDropDownItem id={product.id} isAvailableForPurchade={product.isAvailableForPurchase} />
                                        <DropdownMenuSeparator />
                                    <DeleteDropDownItem id={product.id} disabled={product._count.orders > 0} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
     </Table>
    </>
}