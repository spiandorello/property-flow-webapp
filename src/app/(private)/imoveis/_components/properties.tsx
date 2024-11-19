'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppBar } from '@/store/appBar/appBar'
import { useEffect } from 'react'
import { useListProperties } from '@/hooks/queries/proprieties/useProperties'
import { useRouter } from 'next/navigation'

export function Properties() {
  const { data } = useListProperties()
  const router = useRouter()
  const { setActions, setTitle } = useAppBar()

  useEffect(() => {
    setTitle('Imovéis')
    setActions([
      {
        icon: 'plus',
        label: 'Novo',
        onClick: () => router.push('/imoveis/cadastrar'),
      },
    ])
  }, [setActions, setTitle, router])

  return (
    <div className="mt-4 px-4">
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead className="w-[100px]">Ano</TableHead>
            <TableHead>Locador</TableHead>
            <TableHead>Contato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.code}</TableCell>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.address.street}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.lessor.name}</TableCell>
              <TableCell>{item.lessor?.contacts[0]?.contact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
