import type { Metadata } from 'next'
import { Lessors } from '@/app/(private)/locadores/_components/lessors'

export const metadata: Metadata = {
  title: 'Locadores',
  description: 'Generated by create next app',
}

export default async function Page() {
  return <Lessors />
}
