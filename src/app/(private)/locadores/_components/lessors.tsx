'use client'
import { useAppBar } from '@/store/appBar/appBar'
import { useEffect } from 'react'
import { LessorContact, useLessors } from '@/hooks/queries/lessors/useLessors'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function Lessors() {
  const { setActions, setTitle } = useAppBar()
  const { data: lessorsData, isLoading } = useLessors()

  console.log(lessorsData)

  useEffect(() => {
    setTitle('Locadores')
    setActions([])
  }, [setActions, setTitle])

  const filterContactByType = (contacts: LessorContact[], type: string) => {
    return contacts.find((contact) => contact.type === type)
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="mt-4 px-4">
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessorsData?.data?.map((lessor) => (
            <TableRow key={lessor.id}>
              <TableCell>{lessor.name}</TableCell>
              <TableCell>{lessor.registration_code}</TableCell>
              <TableCell>
                {filterContactByType(lessor.contacts, 'email')?.contact ?? '-'}
              </TableCell>
              <TableCell>
                {filterContactByType(lessor.contacts, 'phone')?.contact ?? '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
