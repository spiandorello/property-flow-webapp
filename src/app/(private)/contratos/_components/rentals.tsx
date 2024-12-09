'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppBar } from '@/store/appBar/appBar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListContracts } from '@/hooks/queries/contracts/useContracts'

export function Rentals() {
  const { push } = useRouter()
  const { setActions, setTitle } = useAppBar()

  const handleRowClick = (id: string) => {
    push(`/contratos/${id}`)
  }

  const { data: contracts } = useListContracts()

  useEffect(() => {
    setTitle('Contratos')
    setActions([
      {
        label: 'Novo contrato',
        onClick: () => push('/contratos/novo'),
        icon: 'add',
      },
    ])
  }, [setActions, setTitle])

  return (
    <div className="mt-4 px-4">
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Imóvel</TableHead>
            <TableHead>Tipo de imóvel</TableHead>
            <TableHead>Locador</TableHead>
            <TableHead>Locatário</TableHead>
            <TableHead>Valor do aluguel</TableHead>
            <TableHead>Data de início</TableHead>
            <TableHead>Data de término</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts?.data?.map((item) => (
            <TableRow key={item.id} onClick={() => handleRowClick(item.id)}>
              {/* <TableCell>{item}</TableCell> */}
              {/* <TableCell className="font-medium">{item.property}</TableCell> */}
              <TableCell>{item.property.code}</TableCell>
              <TableCell>{item.property.type}</TableCell>
              <TableCell>{item.lessor.name}</TableCell>
              <TableCell>{item.tenant.name}</TableCell>
              <TableCell>{item.monthly_rent}</TableCell>
              <TableCell>{item.start_date}</TableCell>
              <TableCell>{item.end_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
