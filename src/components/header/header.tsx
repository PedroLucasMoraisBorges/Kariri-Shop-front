import { Search, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

import { AccountMenu } from '../acccount_menu/account-menu'
import { ThemeToggle } from '../theme/theme-toggle'
import { Button } from '../ui/button'
import { InputKariri } from '../ui/input-kariri'
import { NavigationHeader } from '../ui/nav-header'

export function Header() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token'),
  )
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'))
    }

    // Ouvindo mudanças no localStorage (ex: logout em outra aba)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  return (
    <div className="border-b bg-blue-800 text-white">
      <div className="flex h-16 items-center gap-6 px-6">
        <ShoppingBag className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6 dark:bg-white" />
        <nav className="flex w-full items-center justify-around space-x-4 lg:space-x-6">
          <NavigationHeader />

          <div className="flex items-center gap-2 text-white">
            <InputKariri
              placeholder="Busque pelo produto ou loja"
              className="w-80 pl-10"
              type="text"
              onChange={(e) => {
                const value = e.target.value
                if (value) {
                  setSearch(value)
                }
              }}
            />
            <Button
              type="submit"
              variant={'ghost'}
              className="bg-white text-black dark:bg-black dark:text-white"
              onClick={() => navigate(`/searchProducts/${search}`)}
            >
              <Search className="h-4 w-4" />
              <span className="ml-2">Buscar</span>
            </Button>
          </div>

          {!isAuthenticated && (
            <Link className="font-semibold" to="/sign-up">
              Olá, Registre-se
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && <AccountMenu />}
        </div>
      </div>
    </div>
  )
}
