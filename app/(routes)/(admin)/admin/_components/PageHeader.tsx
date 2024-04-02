
import React, { ComponentPropsWithoutRef, FC, } from 'react'

type PageHeaderProps = ComponentPropsWithoutRef<'h1'>

const PageHeader: FC<PageHeaderProps> = ({children, ...props}) => {
  return (
    <h1 className='text-4xl mb-4' {...props}>
      {children}
    </h1>
  )
}

export default PageHeader