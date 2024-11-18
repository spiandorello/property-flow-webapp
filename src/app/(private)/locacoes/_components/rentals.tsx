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

const data = [
  {
    id: 1,
    code: 'IMV001',
    type: 'Residencial',
    address: 'Rua A, 123',
    year: 2020,
    lessor: {
      name: 'João Silva',
      contacts: [{ type: 'phone', contact: '1234-5678' }],
    },
    tenant: 'Maria Oliveira',
    rentValue: 1500,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
  },
  {
    id: 2,
    code: 'IMV002',
    type: 'Comercial',
    address: 'Avenida B, 456',
    year: 2018,
    lessor: {
      name: 'Ana Souza',
      contacts: [{ type: 'email', contact: 'ana@example.com' }],
    },
    tenant: 'Carlos Pereira',
    rentValue: 2500,
    startDate: '2023-02-01',
    endDate: '2024-01-31',
  },
]

export function Rentals() {
  const { push } = useRouter()
  const { setActions, setTitle } = useAppBar()

  const handleRowClick = (id: number) => {
    push(`/locacoes/${id}`)
  }

  useEffect(() => {
    setTitle('Locações')
    setActions([])
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
          {data.map((item) => (
            <TableRow key={item.id} onClick={() => handleRowClick(item.id)}>
              <TableCell>{item.code}</TableCell>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.lessor.name}</TableCell>
              <TableCell>{item.tenant}</TableCell>
              <TableCell>{item.rentValue}</TableCell>
              <TableCell>{item.startDate}</TableCell>
              <TableCell>{item.endDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
