
import React, { ReactNode } from 'react';
import { NavLink, Navbar } from '@/components/Navbar';


type AdminLayoutProps = {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

const AdminLayout = ({children}: AdminLayoutProps) => {
  return (
    <main>

      <Navbar>
        
        <div className='flex flex-1 self-stretch'>
          <NavLink href="/">Dashboard</NavLink>
          <NavLink href="/admin/products">Products</NavLink>
          <NavLink href="/admin/users">Customers</NavLink>
          <NavLink href="/admin/orders">Sales</NavLink>
        </div>

        <div className="flex items-center self-stretch">
          <h2>Mobile Nav</h2>
        </div>

      </Navbar>

      <section className="container my-6">
        {children}
      </section>

    </main>
  )
}

export default AdminLayout