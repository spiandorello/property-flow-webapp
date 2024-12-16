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

const expenseSchema = z.object({
  status: z.string(),
  description: z.string(),
  category: z.string(),
  account: z.string(),
  paymentMethod: z.string(),
  amount: z.number().min(0),
})

export function RentalExpanses() {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      status: '',
      description: '',
      category: '',
      account: '',
      paymentMethod: '',
      amount: 0,
    },
  })

  const onSubmit = (data: z.infer<typeof expenseSchema>) => {
    console.log(data)
    reset({
      status: '',
      description: '',
      category: '',
      account: '',
      paymentMethod: '',
      amount: 0,
    })
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
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="categoria1">Categoria 1</SelectItem>
                    <SelectItem value="categoria2">Categoria 2</SelectItem>
                    <SelectItem value="categoria3">Categoria 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>
          <FormItem>
            <Label htmlFor="account">Conta</Label>
            <Controller
              name="account"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meio1">Conta 1</SelectItem>
                    <SelectItem value="meio2">Conta 2</SelectItem>
                    <SelectItem value="meio3">Conta 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>
          <FormItem>
            <Label htmlFor="paymentMethod">Meio de pagamento</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Selecione um meio de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meio1">Meio 1</SelectItem>
                    <SelectItem value="meio2">Meio 2</SelectItem>
                    <SelectItem value="meio3">Meio 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>

          <FormItem>
            <Label htmlFor="amount">Valor</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  id="amount"
                  placeholder="Valor"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              )}
            />
          </FormItem>

          <FormItem>
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Input id="status" placeholder="Status" {...field} />
              )}
            />
          </FormItem>
          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
