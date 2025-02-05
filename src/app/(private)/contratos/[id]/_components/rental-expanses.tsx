import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { FormItem } from '@/components/ui/form'
import { useCreateContractExpanse } from '@/hooks/queries/contracts/useContractExpanses'

function formatCurrency(
  value: number,
  locale: string,
  currency: string,
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value,
  )
}

const expenseSchema = z.object({
  description: z.string().min(2),
  category: z.object({ id: z.string().min(1), name: z.string().min(1) }),
  amount: z.number().min(0.01),
})

export function RentalExpanses({ contractId }: { contractId: string }) {
  const createExpanseMutation = useCreateContractExpanse(contractId)
  const { control, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      category: { id: '', name: '' },
      amount: 0,
    },
  })

  const onSubmit = (data: z.infer<typeof expenseSchema>) => {
    createExpanseMutation.mutate(
      {
        ...data,
        amount: data.amount * 100,
        category_id: data.category.id,
      },
      {
        onSuccess: () => {
          reset()
        },
      },
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle />
          Adicionar despesa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar despesa</DialogTitle>
          <DialogDescription>
            Crie uma nova despesa para este contrato.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormItem>
            <Label htmlFor="description">Descrição</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input id="description" placeholder="Descrição" {...field} />
              )}
            />
          </FormItem>
          <FormItem>
            <Label htmlFor="category">Categoria</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value.id}
                  onValueChange={(value) =>
                    field.onChange({ id: value, name: `Categoria ${value}` })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="f218abb3-56ad-487d-acaa-b49464480809">
                      Categoria 1
                    </SelectItem>
                    {/* <SelectItem value="f218abb3-56ad-487d-acaa-b49464480809"> */}
                    {/*  Categoria 2 */}
                    {/* </SelectItem> */}
                    {/* <SelectItem value="f218abb3-56ad-487d-acaa-b49464480809"> */}
                    {/*  Categoria 3 */}
                    {/* </SelectItem> */}
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>

          <FormItem>
            <Label htmlFor="amount">Valor pago</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Digite o valor do pagamento"
                  {...field}
                  value={
                    field.value
                      ? formatCurrency(Number(field.value), 'pt-BR', 'BRL')
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    field.onChange(value ? parseFloat(value) / 100 : '')
                  }}
                />
              )}
            />
          </FormItem>

          <DialogFooter>
            <Button disabled={!formState.isValid} type="submit">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
