'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'

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
import { useCreateContract } from '@/hooks/mutations/contracts/create'

function formatCurrency(
  value: number,
  locale: string,
  currency: string,
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value,
  )
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
  monthly_rent: z.number(),
  due_day: z.string(),
  security_deposit: z.number(),
})

export function CreateContract() {
  const { setActions, setTitle } = useAppBar()
  const router = useRouter()
  const { mutateAsync: createContract } = useCreateContract()
  const { toast } = useToast()
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
    console.log(tenant)
    if (tenant) {
      form.setValue('tenant.name', tenant.name)
      // form.setValue('tenant.email', tenant.email)
      // form.setValue('tenant.phone', tenant.phone)
    }
  }, [tenant, form])

  async function onSubmit(data: z.infer<typeof contractSchema>) {
    try {
      await createContract({
        property_id: data.property.value,
        tenant: {
          id: tenant?.id || null,
          name: data.tenant.name,
          email: data.tenant.email,
          phone: data.tenant.phone,
          registration_code: data.tenant.registration_code,
        },
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        monthly_rent: data.monthly_rent,
        due_day: Number(data.due_day),
        security_deposit: data.security_deposit,
      })

      toast({
        title: 'Contrato criado com sucesso!',
        description: 'O contrato foi criado com sucesso.',
      })

      router.push(`/contratos`)
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

              <div className="mt-4 mb-4 font-bold">
                Preencha as informações do locatário
              </div>

              <CpfOrCnpjInput
                name="tenant.registration_code"
                label="Digite o CPF/CNPJ do locatário"
                placeholder="cpf/cnpj"
                className="mt-4 w-[240px]"
                disabled={form.getValues('property.value') === ''}
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
                      name=""
                      label="CPF/CNPJ do locatário"
                      placeholder="cpf/cnpj"
                      className="w-[240px]"
                      defaultValue={tenantRegistrationCode}
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

              <div className="mt-4 mb-4 font-bold">
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
                          value={
                            field.value
                              ? formatCurrency(
                                  Number(field.value),
                                  'pt-BR',
                                  'BRL',
                                )
                              : ''
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            field.onChange(value ? parseFloat(value) / 100 : '')
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            if (
                              value === '' ||
                              (Number(value) > 0 && Number(value) <= 31)
                            ) {
                              field.onChange(value)
                            }
                          }}
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
                        value={
                          field.value
                            ? formatCurrency(
                                Number(field.value),
                                'pt-BR',
                                'BRL',
                              )
                            : ''
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value ? parseFloat(value) / 100 : '')
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-1 justify-end mt-8">
                <Button disabled={!form.formState.isValid} type="submit">
                  Criar contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
