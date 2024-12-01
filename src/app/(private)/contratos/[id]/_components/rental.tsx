'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAppBar } from '@/store/appBar/appBar'

export function Rental() {
  const { id } = useParams()
  const { setActions, setTitle } = useAppBar()

  useEffect(() => {
    setTitle('Locações')
    setActions([])
  }, [setActions, setTitle])

  return <div>Locação ID: {id}</div>
}
