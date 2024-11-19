import { Rental } from '@/app/(private)/locacoes/[id]/_components/rental'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Locações',
  description: 'Generated by create next app',
}

export default function Page() {
  return <Rental />
}