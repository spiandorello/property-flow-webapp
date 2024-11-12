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
import { useRouter } from 'next/navigation'

const addressSchema = z.object({
  street: z.string().min(1, 'Logradouro é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  zip_code: z.string().min(1, 'Cep é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
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
  <div className="flex space-x-4 w-full">{children}</div>
)

export function RegisterProperties() {
  const { setActions, setTitle } = useAppBar()
  const { mutateAsync, isPending } = useCreateProperty()
  const router = useRouter()

  useEffect(() => {
    setTitle('Imovéis | Cadastrar')
    setActions([])
  }, [setActions, setTitle])

  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      type: '',
      code: '',
      address: {
        street: '',
        number: '',
        zip_code: '',
        complement: '',
        neighborhood: '',
      },
      year: '',
    },
  })

  async function onSubmit(data: z.infer<typeof propertiesSchema>) {
    try {
      await mutateAsync({
        type: data.type,
        code: data.code,
        address: {
          street: data.address.street,
          number: data.address.number,
          zip_code: data.address.zip_code,
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
        },
        year: data.year,
      })

      router.push('/imoveis')
    } catch {}
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Insira as informações do imóvel</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para cadastrar um imóvel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Input placeholder="Digite o ano" {...field} />
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
                        <Input placeholder="Digite o cep" {...field} />
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
                        <Input placeholder="Digite o número" {...field} />
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

              <Button disabled={isPending} className="w-full" type="submit">
                Salvar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
