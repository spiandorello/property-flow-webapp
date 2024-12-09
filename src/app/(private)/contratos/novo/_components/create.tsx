'use client'

import { useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
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
import { SearchableSelect } from '@/components/app/searchableSelect/SearchableSelect'
import CpfOrCnpjInput from '@/components/app/form/cpf-or-cnpj-input'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/app/form/data-picker'
import { useSearchProperties } from '@/hooks/queries/proprieties/useProperties'
import { useTenant } from '@/hooks/queries/tenants/useTenants'
import {
  InputGroup,
  phoneNumberMask,
} from '@/app/(private)/imoveis/editar/[id]/_compoenents/edit'

export const cpfOrCnpjMask = (value: string) => {
  value = value.replace(/\D/g, '') // Remove all non-digit characters

  if (value.length <= 11) {
    return value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  return value
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18)
}

const contractSchema = z.object({
  property: z.object({
    value: z.string(),
    label: z.string(),
  }),
  tenant: z.object({
    name: z.string(),
    registration_code: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  start_date: z.date(),
  end_date: z.date(),
  monthly_rent: z.string(),
  due_day: z.string(),
  security_deposit: z.string(),
})

export function CreateContract() {
  const { setActions, setTitle } = useAppBar()

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      property: { value: '', label: '' },
      tenant: { name: '', registration_code: '', email: '', phone: '' },
    },
  })

  const propertyCode = useWatch({
    control: form.control,
    name: 'property.value',
  })
  const tenantRegistrationCode = useWatch({
    control: form.control,
    name: 'tenant.registration_code',
  })

  const { data: searchResults } = useSearchProperties({ code: propertyCode })
  const { data: tenant, isLoading: tenantIsLoading } = useTenant({
    registration_code: tenantRegistrationCode,
  })

  useEffect(() => {
    setTitle('Novo contrato')
    setActions([])
  }, [setActions, setTitle])

  useEffect(() => {
    if (tenant) {
      form.setValue('tenant.name', tenant.name)
    }
  }, [tenant, form])

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
                name="property"
                label="Selecione o imóvel"
                options={propertyOptions}
                placeholder="Selecione o imóvel..."
              />

              <CpfOrCnpjInput
                name="tenant.registration_code"
                label="Digite o CPF/CNPJ do locatário"
                placeholder="cpf/cnpj"
                className="mt-4 w-[240px]"
                defaultValue={tenantRegistrationCode}
              />

              {tenantRegistrationCode && !tenantIsLoading && (
                <Card className="mt-4">
                  <CardHeader>
                    <p>
                      Adicione um novo locatário com o cpf/cnpj{' '}
                      {tenantRegistrationCode}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <CpfOrCnpjInput
                      disabled
                      name="tenant.registration_code"
                      label="CPF/CNPJ do locatário"
                      placeholder="cpf/cnpj"
                      className="w-[240px]"
                    />

                    <FormField
                      control={form.control}
                      name="tenant.name"
                      render={({ field }) => (
                        <FormItem className="w-[480px]">
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o nome do locatário"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <InputGroup>
                      <FormField
                        control={form.control}
                        name="tenant.email"
                        render={({ field }) => (
                          <FormItem className="w-[480px]">
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite o E-mail" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tenant.phone"
                        render={({ field }) => (
                          <FormItem className="w-[480px]">
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite o telefone"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  field.onChange(
                                    phoneNumberMask(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </InputGroup>
                  </CardContent>
                </Card>
              )}

              <div className="mt-8 mb-4 font-bold">
                Insira as configurações do contrato
              </div>

              <InputGroup>
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
              </InputGroup>

              <InputGroup>
                <Controller
                  name="monthly_rent"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-[280px]">
                      <FormLabel>Aluguel Mensal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o valor do aluguel mensal"
                          {...field}
                          value={field.value ?? ''}
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
                    <FormItem className="w-[280px]">
                      <FormLabel>Dia de Vencimento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o dia de vencimento"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputGroup>

              <Controller
                name="security_deposit"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-[480px]">
                    <FormLabel>Depósito de Segurança</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o valor do depósito de segurança"
                        {...field}
                        value={field.value ?? ''}
                      />
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
