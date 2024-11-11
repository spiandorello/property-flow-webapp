'use client'
// import type { Metadata } from 'next'
import { useEffect } from 'react'
import { useAppBar } from '@/store/appBar/appBar'

// export const metadata: Metadata = {
//   title: 'Dashboard',
//   description: 'Generated by create next app',
// }

export default function Page() {
  const { setActions, setTitle } = useAppBar()

  useEffect(() => {
    setTitle('Dashboard')
    setActions([])
  }, [])

  return <div>maoi</div>
}
