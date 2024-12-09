import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

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

interface CpfOrCnpjInputProps {
  name: string
  label: string
  placeholder: string
  className?: string
  disabled?: boolean
  defaultValue?: string
}

const CpfOrCnpjInput: React.FC<CpfOrCnpjInputProps> = ({
  name,
  label,
  placeholder,
  className,
  disabled,
  defaultValue,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(cpfOrCnpjMask(e.target.value))
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CpfOrCnpjInput
