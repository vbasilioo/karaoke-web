import { useTheme } from 'next-themes'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Moon, Sun } from 'lucide-react'

const LightTheme = () => {
  return <Sun className="block text-white" size={20} />
}

const DarkTheme = () => {
  return <Moon className="block text-gray-900 dark:text-white" size={20} />
}

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="border-none bg-transparent p-2 focus:outline-none">
          {theme === 'light' ? <LightTheme /> : <DarkTheme />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex max-w-36 flex-col gap-3">
        <button
          className="flex w-full items-center gap-2 border-none bg-transparent p-2 focus:outline-none"
          disabled={theme === 'light'}
          onClick={() => setTheme('light')}
        >
          <LightTheme />
          <span className="text-gray-900 dark:text-white">Claro</span>
        </button>
        <button
          className="flex w-full items-center gap-2 border-none bg-transparent p-2 focus:outline-none"
          disabled={theme === 'dark'}
          onClick={() => setTheme('dark')}
        >
          <DarkTheme />
          <span className="text-gray-900 dark:text-white">Escuro</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}
