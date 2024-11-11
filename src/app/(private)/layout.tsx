import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/app/sidebar/app-sidebar'
import { AppBar } from '@/components/app/appBar/appBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <AppBar />
        {children}
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  )
}
