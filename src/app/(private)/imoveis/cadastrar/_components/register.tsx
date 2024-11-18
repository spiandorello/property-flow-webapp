'use client'

import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useEffect } from 'react'
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

const addressSchema = z.object({
  street: z.string().min(1, 'Logradouro é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  zip_code: z.string().min(1, 'Cep é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
})

// const contactSchema = z.object({
//   type: z.string().min(1, 'Tipo de contato é obrigatório'),
//   contact: z.string().min(1, 'Contato é obrigatório'),
// })

// const lessorSchema = z.object({
//   name: z.string().min(1, 'Nome é obrigatório'),
//   contacts: z.array(contactSchema),
//   registration_code: z.string().min(1, 'Código de registro é obrigatório'),
//   notes: z.string().optional(),
// })

const propertiesSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  address: addressSchema,
  year: z.string().regex(/^\d{4}$/, 'Ano deve ser um número de 4 dígitos'),
  // lessor: lessorSchema,
})

interface InputGroupProps {
  children: React.ReactNode
}

const InputGroup = ({ children }: InputGroupProps) => (
  <div className="flex space-x-4 w-full items-center">{children}</div>
)

const zipCodeMask = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não for dígito
    .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen
    .slice(0, 9) // Limita o tamanho do input (exato para CEP)
}

const numberMask = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 9)
}

export function RegisterProperties() {
  const { setActions, setTitle } = useAppBar()

  // const { data } = useGetLessorByRegistrationCode({
  //   registrationCode: 'REG123',
  // })
  // console.log(data)

  const { mutateAsync, isPending } = useCreateProperty()

  useEffect(() => {
    setTitle('Imovéis | Cadastrar')
    setActions([])
  }, [setActions, setTitle])

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
      // lessor: {
      //   name: '',
      //   contacts: [{ type: '', contact: '' }],
      //   registration_code: '',
      //   notes: '',
      // },
    },
  })

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'lessor.contacts',
  // })

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
        // lessor: {
        //   name: data.lessor.name,
        //   contacts: data.lessor.contacts,
        //   registration_code: data.lessor.registration_code,
        //   notes: data.lessor.notes,
        // },
      })
      // router.push('/imoveis')
    } catch {}
  }

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insira as informações do imóvel</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para cadastrar um imóvel.
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
                        <Input placeholder="Digite o logradouro" {...field} />
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
                        <Input placeholder="Digite o bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputGroup>

              <div className="flex flex-1 justify-end mt-8">
                <Button disabled={isPending} type="submit">
                  Cadastrar imóvel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicione um locador</CardTitle>
              <CardDescription>
                Clique no botão e adicione o locador deste imóvel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Tabs defaultValue="register_lessor">
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

                {/* <TabsContent value="register_lessor"> */}
                {/*  <Card className="flex-1"> */}
                {/*    <CardHeader> */}
                {/*      <CardTitle>Insira as informações do locador</CardTitle> */}
                {/*      <CardDescription> */}
                {/*        Preencha os campos abaixo para cadastrar um locador. */}
                {/*      </CardDescription> */}
                {/*    </CardHeader> */}

                {/*    <CardContent> */}
                {/*      <FormField */}
                {/*        control={form.control} */}
                {/*        name="lessor.registration_code" */}
                {/*        render={({ field }) => ( */}
                {/*          <FormItem> */}
                {/*            <FormLabel>CPF/CNPJ</FormLabel> */}
                {/*            <FormControl> */}
                {/*              <Input placeholder="Digite o CPF/CNPJ" {...field} /> */}
                {/*            </FormControl> */}
                {/*            <FormMessage /> */}
                {/*          </FormItem> */}
                {/*        )} */}
                {/*      /> */}

                {/*      <FormField */}
                {/*        control={form.control} */}
                {/*        name="lessor.name" */}
                {/*        render={({ field }) => ( */}
                {/*          <FormItem> */}
                {/*            <FormLabel>Nome</FormLabel> */}
                {/*            <FormControl> */}
                {/*              <Input placeholder="Digite o nome" {...field} /> */}
                {/*            </FormControl> */}
                {/*            <FormMessage /> */}
                {/*          </FormItem> */}
                {/*        )} */}
                {/*      /> */}
                {/*      {fields.map((field, index) => ( */}
                {/*        <InputGroup key={field.id}> */}
                {/*          <FormField */}
                {/*            control={form.control} */}
                {/*            name={`lessor.contacts.${index}.type`} */}
                {/*            render={({ field }) => ( */}
                {/*              <FormItem> */}
                {/*                <FormLabel>Tipo de Contato</FormLabel> */}
                {/*                <FormControl> */}
                {/*                  <Select */}
                {/*                    value={field.value} */}
                {/*                    onValueChange={field.onChange} */}
                {/*                  > */}
                {/*                    <SelectTrigger className="w-[180px]"> */}
                {/*                      <SelectValue placeholder="Tipo de Contato" /> */}
                {/*                    </SelectTrigger> */}
                {/*                    <SelectContent> */}
                {/*                      <SelectItem value="phone"> */}
                {/*                        Telefone */}
                {/*                      </SelectItem> */}
                {/*                      <SelectItem value="email">Email</SelectItem> */}
                {/*                    </SelectContent> */}
                {/*                  </Select> */}
                {/*                </FormControl> */}
                {/*                <FormMessage /> */}
                {/*              </FormItem> */}
                {/*            )} */}
                {/*          /> */}
                {/*          <FormField */}
                {/*            control={form.control} */}
                {/*            name={`lessor.contacts.${index}.contact`} */}
                {/*            render={({ field }) => ( */}
                {/*              <FormItem className="w-[180px]"> */}
                {/*                <FormLabel>Contato</FormLabel> */}
                {/*                <FormControl> */}
                {/*                  <Input */}
                {/*                    placeholder="Digite o contato" */}
                {/*                    {...field} */}
                {/*                  /> */}
                {/*                </FormControl> */}
                {/*                <FormMessage /> */}
                {/*              </FormItem> */}
                {/*            )} */}
                {/*          /> */}
                {/*          <Button */}
                {/*            className="self-end" */}
                {/*            type="button" */}
                {/*            onClick={() => remove(index)} */}
                {/*          > */}
                {/*            Remover */}
                {/*          </Button> */}
                {/*        </InputGroup> */}
                {/*      ))} */}
                {/*      <Button */}
                {/*        type="button" */}
                {/*        onClick={() => append({ type: '', contact: '' })} */}
                {/*      > */}
                {/*        Adicionar novo Contato */}
                {/*      </Button> */}
                {/*      <FormField */}
                {/*        control={form.control} */}
                {/*        name="lessor.notes" */}
                {/*        render={({ field }) => ( */}
                {/*          <FormItem> */}
                {/*            <FormLabel>Notas</FormLabel> */}
                {/*            <FormControl> */}
                {/*              <Input placeholder="Digite as notas" {...field} /> */}
                {/*            </FormControl> */}
                {/*            <FormMessage /> */}
                {/*          </FormItem> */}
                {/*        )} */}
                {/*      /> */}
                {/*    </CardContent> */}
                {/*  </Card> */}
                {/* </TabsContent> */}
                <TabsContent value="append_lessor"></TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
