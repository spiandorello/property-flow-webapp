import { create } from 'zustand'

const APP_BAR_INITIAL_STATE = {
  title: '',
  actions: [],
}

type AppBarActions = {
  icon: string
  onClick: () => void
  label: string
  disabled?: boolean
}

type AppBar = {
  title: string
  actions: AppBarActions[]
  setTitle: (title: string) => void
  setActions: (actions: AppBarActions[]) => void
}

export const useAppBar = create<AppBar>()((set) => ({
  ...APP_BAR_INITIAL_STATE,
  setTitle: (title: string) => set({ title }),
  setActions: (actions: AppBarActions[]) => set({ actions }),
}))
