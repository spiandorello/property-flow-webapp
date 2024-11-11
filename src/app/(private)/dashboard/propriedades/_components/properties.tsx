'use client'

import {
  Table,
  TableBody,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppBar } from '@/store/appBar/appBar'
import { useEffect } from 'react'
import { useListProperties } from '@/hooks/queries/proprieties/useProperties'

export function Properties() {
  const { data } = useListProperties({})
  const { setActions, setTitle } = useAppBar()

  useEffect(() => {
    setTitle('Propriedades')
    setActions([
      {
        icon: 'plus',
        label: 'Adicionar',
        onClick: () => alert('Adicionar'),
      },
    ])
  }, [setActions, setTitle])

  console.log(data)

  return (
    <div className="mt-4 px-4">
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {[].map((invoice) => ( */}
          {/*  <TableRow key={invoice.invoice}> */}
          {/*    <TableCell className="font-medium">{invoice.invoice}</TableCell> */}
          {/*    <TableCell>{invoice.paymentStatus}</TableCell> */}
          {/*    <TableCell>{invoice.paymentMethod}</TableCell> */}
          {/*    <TableCell className="text-right"> */}
          {/*      {invoice.totalAmount} */}
          {/*    </TableCell> */}
          {/*  </TableRow> */}
          {/* ))} */}
        </TableBody>
      </Table>
    </div>
  )
}
