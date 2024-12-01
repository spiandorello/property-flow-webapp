'use client'

import { useState, useEffect } from 'react'

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useAppBar } from '@/store/appBar/appBar'
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Controller, useForm } from 'react-hook-form'

import { SearchableSelect } from '@/components/app/searchableSelect/SearchableSelect'
import CpfOrCnpjInput from '@/components/app/form/cpf-or-cnpj-input'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/app/form/data-picker'
import { useSearchProperties } from '@/hooks/queries/proprieties/useProperties'
import { z } from 'zod'

const contractSchema = z.object({
  property_id: z.string(),
})

export function CreateContract() {
  const { setActions, setTitle } = useAppBar()
  const [searchParams, setSearchParams] = useState('')

  const { data: searchResults } = useSearchProperties({ code: searchParams })

  const form = useForm()

  useEffect(() => {
    setTitle('Novo contrato')
    setActions([])
  }, [setActions, setTitle])

  async function onSubmit(data: z.infer<typeof contractSchema>) {
    try {
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }

  const propertyOptions =
    searchResults?.data.map((property) => ({
      value: property.id,
      label: property.code,
    })) || []

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insira as informações do contrato</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para criar um contrato.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SearchableSelect
                name="selectField"
                label="Selecione o imóvel"
                options={propertyOptions}
                placeholder="Selecione o imóvel ..."
                onSearchChange={setSearchParams}
              />

              <CpfOrCnpjInput
                name="cpf"
                label="Digite o CPF/CNPJ do locatário"
                placeholder=""
                className="w-[240px]"
              />

              <Controller
                name="start_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <DatePicker label={''} placeholder={''} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="end_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <DatePicker label={''} placeholder={''} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="monthly_rent"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aluguel Mensal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o valor do aluguel mensal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="due_day"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o dia de vencimento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="security_deposit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depósito de Segurança</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o valor do depósito de segurança"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-1 justify-end mt-8">
                <Button type="submit">Criar contrato</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
