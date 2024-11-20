'use client'

import { z } from 'zod'
import { useParams } from 'next/navigation'
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useMemo, useState } from 'react'
import { useAppBar } from '@/store/appBar/appBar'
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useCreateProperty } from '@/hooks/mutations/proprieties/create'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCep } from '@/hooks/queries/cep/useCep'
import { useProperty } from '@/hooks/queries/proprieties/useProperties'
import { useCreateLessor } from '@/hooks/mutations/lessors/create'
import { useSearchLessors } from '@/hooks/queries/lessors/useLessors'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const addressSchema = z.object({
  street: z.string().min(1, 'Logradouro é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  zip_code: z.string().min(1, 'Cep é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
})

const contactSchema = z.object({
  type: z.string().min(1, 'Tipo de contato é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
})

const lessorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  contacts: z.array(contactSchema),
  registration_code: z.string().min(1, 'Código de registro é obrigatório'),
  notes: z.string().optional(),
})

const lessorAppendSchema = z.object({
  lessor: z.object({ value: z.string(), label: z.string() }),
})

const propertiesSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  address: addressSchema,
  year: z.string().regex(/^\d{4}$/, 'Ano deve ser um número de 4 dígitos'),
})

interface InputGroupProps {
  children: React.ReactNode
}

const InputGroup = ({ children }: InputGroupProps) => (
  <div className="flex space-x-4 w-full items-center">{children}</div>
)

const cpfOrCnpjMask = (value: string) => {
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

const zipCodeMask = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não for dígito
    .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen
    .slice(0, 9) // Limita o tamanho do input (exato para CEP)
}

const numberMask = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 9)
}

const phoneNumberMask = (value: string) => {
  value = value.replace(/\D/g, '') // Remove all non-digit characters

  if (value.length <= 10) {
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }

  return value
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

export function EditProperties() {
  const { id } = useParams()
  const { setActions, setTitle } = useAppBar()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useState('')

  const { data: searchedLessors } = useSearchLessors(
    { name: searchParams, registration_code: searchParams },
    {
      queryKey: [
        'lessors',
        { name: searchParams, registration_code: searchParams },
      ],
    },
  )
  const { mutateAsync: createLessor } = useCreateLessor()

  const { data: propertyData, isLoading } = useProperty(
    {
      id: id as string,
    },
    { enabled: !!id, queryKey: ['property', { id }] },
  )

  const { mutateAsync, isPending } = useCreateProperty()

  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      type: '',
      code: '',
      year: '',
      address: {
        street: '',
        number: '',
        zip_code: '',
        complement: '',
        neighborhood: '',
      },
    },
  })

  const lessorForm = useForm<z.infer<typeof lessorSchema>>({
    resolver: zodResolver(lessorSchema),
    defaultValues: {
      name: '',
      contacts: [{ type: '', contact: '' }],
      registration_code: '',
      notes: '',
    },
  })

  const lessorsAppendForm = useForm<z.infer<typeof lessorAppendSchema>>({
    resolver: zodResolver(lessorAppendSchema),
    defaultValues: {
      lessor: { value: '', label: '' },
    },
  })

  const zipCode = useWatch({ control: form.control, name: 'address.zip_code' })
  const rawZipCode = useMemo(() => zipCode.replace(/\D/g, ''), [zipCode])

  const contactsType = useWatch({
    control: lessorForm.control,
    name: 'contacts',
  })

  const { data } = useCep(
    { cep: rawZipCode },
    {
      enabled: !!rawZipCode && rawZipCode.length === 8,
      queryKey: ['cep', { cep: rawZipCode }],
    },
  )

  const { fields, append, remove } = useFieldArray({
    control: lessorForm.control,
    name: 'contacts',
  })

  async function onSubmit(data: z.infer<typeof propertiesSchema>) {
    try {
      await mutateAsync({
        type: data.type,
        code: data.code,
        year: data.year,
        address: {
          street: data.address.street,
          number: data.address.number,
          zip_code: data.address.zip_code,
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
        },
      })

      toast({
        title: 'Imóvel editado com sucesso!',
        description: 'O imóvel foi editado com sucesso.',
      })
    } catch {}
  }

  async function onLessorSubmit(data: z.infer<typeof lessorSchema>) {
    try {
      await createLessor({
        name: data.name,
        contacts: data.contacts,
        registration_code: data.registration_code,
        notes: data.notes,
        property_id: id as string,
      })

      toast({
        title: 'Locador adicionado com sucesso!',
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function onLessorAppendSubmit(
    data: z.infer<typeof lessorAppendSchema>,
  ) {
    console.log(data.lessor, id as string)

    try {
      toast({
        title: 'Locador vinculado com sucesso!',
      })
    } catch {}
  }

  useEffect(() => {
    if (data) {
      form.setValue('address.street', data.logradouro || '')
      form.setValue('address.neighborhood', data.bairro || '')
    }
  }, [data, form.setValue])

  useEffect(() => {
    setTitle('Imovéis | Editar')
    setActions([])
  }, [setActions, setTitle])

  useEffect(() => {
    if (isLoading || !propertyData) return
    form.setValue('type', propertyData.type)
    form.setValue('code', propertyData.code)
    form.setValue('year', propertyData.year)
    form.setValue('address.zip_code', propertyData.address.zip_code)
    form.setValue('address.street', propertyData.address.street)
    form.setValue('address.number', propertyData.address.number)
    form.setValue('address.complement', propertyData.address.complement)
    form.setValue('address.complement', propertyData.address.complement)
    form.setValue('address.neighborhood', propertyData.address.neighborhood)
  }, [propertyData])

  return (
    <div className="p-6 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insira as informações do imóvel</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para editar um imóvel.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <InputGroup>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">
                              Residencial
                            </SelectItem>
                            <SelectItem value="commercial">
                              Comercial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o código" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o ano"
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            field.onChange(
                              numberMask(e.target.value).slice(0, 4),
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputGroup>

              <InputGroup>
                <FormField
                  control={form.control}
                  name="address.zip_code"
                  render={({ field }) => (
                    <FormItem className="w-[180px]">
                      <FormLabel>Cep</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            field.onChange(zipCodeMask(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Digite o logradouro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputGroup>

              <InputGroup>
                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem className="w-[180px]">
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o número"
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            field.onChange(numberMask(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.complement"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o complemento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.neighborhood"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Digite o bairro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputGroup>

              <div className="flex flex-1 justify-end mt-8">
                <Button disabled={isPending} type="submit">
                  Editar imóvel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {propertyData?.lessor?.registration_code && (
        <Card>
          <CardHeader>
            <CardTitle>Locador do imóvel</CardTitle>
            <CardDescription>
              Locador registrado para este imóvel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  {/* <TableHead>Contato</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{propertyData?.lessor.name}</TableCell>
                  <TableCell>
                    {propertyData?.lessor.registration_code}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!isLoading && !propertyData?.lessor?.registration_code && (
        <Card>
          <CardHeader>
            <CardTitle>Adicione um locador</CardTitle>
            <CardDescription>
              Clique no botão e adicione o locador deste imóvel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <Tabs>
              <TabsList className="h-fit flex">
                <TabsTrigger value="register_lessor" className="flex flex-1">
                  <div>
                    <h1 className="text-lg font-bold mb-1">
                      Adicionar locador não cadastrado
                    </h1>
                    <p>
                      Crie o cadastro de um locador ainda não registrado na
                      plataforma.
                    </p>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="append_lessor" className="flex flex-1">
                  <div>
                    <h1 className="text-lg font-bold mb-1">
                      Adicionar locador já cadastrado
                    </h1>
                    <p>
                      Vincule um locador que já foi registrado na plataforma.
                    </p>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="register_lessor">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Insira as informações do locador</CardTitle>
                    <CardDescription>
                      Preencha os campos abaixo para cadastrar um locador.
                    </CardDescription>
                  </CardHeader>

                  <Form {...lessorForm}>
                    <form
                      className="space-y-4"
                      onSubmit={lessorForm.handleSubmit(onLessorSubmit)}
                    >
                      <CardContent>
                        <FormField
                          control={lessorForm.control}
                          name="registration_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF/CNPJ</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Digite o CPF/CNPJ"
                                  {...field}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) => {
                                    field.onChange(
                                      cpfOrCnpjMask(e.target.value),
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={lessorForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite o nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fields.map((field, index) => (
                          <InputGroup key={field.id}>
                            <FormField
                              control={lessorForm.control}
                              name={`contacts.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo de Contato</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Tipo de Contato" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="phone">
                                          Telefone
                                        </SelectItem>
                                        <SelectItem value="email">
                                          Email
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={lessorForm.control}
                              name={`contacts.${index}.contact`}
                              render={({ field }) => (
                                <FormItem className="w-[180px]">
                                  <FormLabel>Contato</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={!contactsType[index]?.type}
                                      placeholder="Digite o contato"
                                      {...field}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        if (
                                          contactsType[index]?.type === 'phone'
                                        ) {
                                          return field.onChange(
                                            phoneNumberMask(e.target.value),
                                          )
                                        }

                                        return field.onChange(e.target.value)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              className="self-end"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              Remover
                            </Button>
                          </InputGroup>
                        ))}
                        <Button
                          type="button"
                          onClick={() => append({ type: '', contact: '' })}
                        >
                          Adicionar novo Contato
                        </Button>
                        <FormField
                          control={lessorForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notas</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Digite as notas"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-1 justify-end mt-8">
                          <Button disabled={isPending} type="submit">
                            Salvar locador
                          </Button>
                        </div>
                      </CardContent>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
              <TabsContent value="append_lessor">
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar locador já cadastrado</CardTitle>
                    <CardDescription>
                      Vincule um locador que já foi registrado na plataforma.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...lessorsAppendForm}>
                      <form
                        className="space-y-4"
                        onSubmit={lessorsAppendForm.handleSubmit(
                          onLessorAppendSubmit,
                        )}
                      >
                        <FormField
                          control={lessorsAppendForm.control}
                          name="lessor"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Selecione o locador</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        'w-[380px] justify-between',
                                        !field.value && 'text-muted-foreground',
                                      )}
                                    >
                                      {field.value.label ||
                                        'Selecione o locador'}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[380px] p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Buscar locador..."
                                      value={searchParams}
                                      onValueChange={(value) => {
                                        setSearchParams(value)
                                        field.onChange(value)
                                      }}
                                    />
                                    <CommandList>
                                      {searchedLessors?.length ? (
                                        <CommandGroup>
                                          {searchedLessors.map((lessor) => (
                                            <CommandItem
                                              key={lessor.value}
                                              value={lessor.label}
                                              onSelect={() => {
                                                field.onChange({
                                                  value: lessor.value,
                                                  label: lessor.label,
                                                })
                                              }}
                                            >
                                              {lessor.label}
                                              <Check
                                                className={cn(
                                                  'ml-auto',
                                                  lessor.value ===
                                                    field.value.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      ) : (
                                        <CommandEmpty>
                                          Nenhum locador encontrado.
                                        </CommandEmpty>
                                      )}
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-1 justify-end mt-8">
                          <Button type="submit">Vincular locador</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
