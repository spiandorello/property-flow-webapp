'use client'
import { Button } from '@/components/ui/button'
import { useAppBar } from '@/store/appBar/appBar'

export function AppBar() {
  const { actions, title } = useAppBar()

  return (
    <div className="flex px-4 justify-between items-center py-3 bg-gray-100 h-16">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div>
        {actions.map(({ onClick, label, disabled }, index) => (
          <Button onClick={onClick} key={index} disabled={disabled}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
