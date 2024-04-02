
import React from 'react'

import DashboardCard from '@/components/DashboardCard'
import prismaDb from '@/app/db/prismaDb';
import { formatCurrency, formatNumber } from '@/lib/formatters';


const getSalesData = async () => {
  const data  = await prismaDb.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
  });

  return {
      amount: (data._sum.pricePaidInCents || 0) / 100,
      numberOfSales: data._count,
  }

}

const getUserData = async () => {

  const [userCount, orderData] = await Promise.all([
    prismaDb.user.count(),
    prismaDb.order.aggregate({
      _sum: { pricePaidInCents: true }
    }),
  ]);

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }

}

const getProductData = async () => {
  const [activeCount, inactiveCount] = await Promise.all([
    prismaDb.product.count({ where: { isAvailableForPurchase: true } }),
    prismaDb.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeCount, inactiveCount }
}


const AdminPage = async () => {

  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  const { amount, numberOfSales } = salesData;
  const { userCount, averageValuePerUser } = userData;
  const { activeCount, inactiveCount } = productData;

  return (
    <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' >
      
      <DashboardCard
        title='Sales'
        subtitle={`${formatNumber(numberOfSales)} Orders`}
        body={formatCurrency(amount)}
      />

      <DashboardCard
        title='Customers'
        subtitle={`${formatCurrency(averageValuePerUser)} Average value`}
        body={formatNumber(userCount)}
      />

      <DashboardCard
        title='Active Products'
        subtitle={`${formatCurrency(inactiveCount)} Inactive`}
        body={formatNumber(activeCount)}
      />

    </section>
  )
}

export default AdminPage