
import React, { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import prismaDb from '@/app/db/prismaDb';

type DashboardCardProps = {
    title: string;
    subtitle: string;
    body: string;
}


const DashboardCard: FC<DashboardCardProps> = ({title, subtitle, body}) => {



  return (
    <>
    <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Text</p>
        </CardContent>
      </Card>
    </>
  )
}

export default DashboardCard