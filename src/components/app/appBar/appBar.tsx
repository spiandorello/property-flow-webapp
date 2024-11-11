'use client'
import { Button } from '@/components/ui/button'
import { useAppBar } from '@/store/appBar/appBar'

export function AppBar() {
  const { actions, title } = useAppBar()

  return (
    <div className="px-4 py-3 bg-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div>
          {actions.map((action, index) => (
            <Button key={index}>Cadastrar propriedades</Button>
          ))}
        </div>
      </div>
    </div>
  )
}
