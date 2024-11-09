import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import type { Metadata } from 'next'
import { AppSidebar } from '@/components/app/sidebar/app-sidebar'

export const metadata: Metadata = {
  title: 'maoiu',
  description: 'Generated by create next app',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log('PrivateLayout')
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
