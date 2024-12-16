'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAppBar } from '@/store/appBar/appBar'
import { useContract } from '@/hooks/queries/contracts/useContracts'
import { MapPin, User, FileText, Phone, Mail } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { RentalExpanses } from '@/app/(private)/contratos/[id]/_components/rental-expanses'

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export function Rental() {
  const { id } = useParams() as { id: string }
  const { setActions, setTitle } = useAppBar()
  const { data: contract } = useContract({ id })

  useEffect(() => {
    setTitle('Contratos')
    setActions([])
  }, [setActions, setTitle])

  if (!contract) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Carregando contrato...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-8 bg-gray-50">
        {/* Detalhes do Contrato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Detalhes do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Data de Início:</span>{' '}
                {new Date(contract.start_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Data de Término:</span>{' '}
                {contract.end_date
                  ? new Date(contract.end_date).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                <span className="font-medium">Aluguel Mensal:</span> R${' '}
                {contract.monthly_rent.toLocaleString('pt-BR')}
              </p>
              <p>
                <span className="font-medium">Dia de Vencimento:</span>{' '}
                {contract.due_day}
              </p>
              <p>
                <span className="font-medium">Depósito de Segurança:</span> R${' '}
                {contract.security_deposit?.toLocaleString('pt-BR') || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Ativo:</span>{' '}
                {contract.enabled ? 'Sim' : 'Não'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Propriedade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Propriedade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Código:</span>{' '}
                {contract.property.code}
              </p>
              <p>
                <span className="font-medium">Tipo:</span>{' '}
                {contract.property.type}
              </p>
              <p>
                <span className="font-medium">Endereço:</span>{' '}
                {`${contract.property.address.street}, ${contract.property.address.number}, ${contract.property.address.neighborhood}, ${contract.property.address.zip_code}`}
              </p>
              <p></p>
              <p>
                <span className="font-medium">Nome do Locador:</span>{' '}
                {contract.lessor.name}
              </p>
              <p>
                <span className="font-medium">CPF/CNPJ do Locador:</span>{' '}
                {contract.lessor.registration_code}
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />{' '}
                {contract.lessor.phone || 'N/A'}
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />{' '}
                {contract.lessor.email || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Locatário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Locatário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Nome:</span>{' '}
                {contract.tenant.name}
              </p>
              <p>
                <span className="font-medium">CPF/CNPJ:</span>{' '}
                {contract.tenant.registration_code}
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />{' '}
                {contract.tenant.phone || 'N/A'}
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />{' '}
                {contract.tenant.email || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center align-middle">
          <h2 className="text-2xl font-medium">Despesas</h2>
          <RentalExpanses />
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Meio de pagamento</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
