/*
Basicamente, o Outlet é o componente que vai especificar o conteúdo de cada página. 
Exemplo abaixo, o cabeçalho vai se repetir em todas as páginas, mas o conteúdo onde o Outlet está vai ser o dinâmico.
 */

import { EmblaOptionsType } from 'embla-carousel'
import { ShoppingCart } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import EmblaCarousel from '@/components/carrosel/emblacarousel'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export function AuthLayout() {
  const OPTIONS: EmblaOptionsType = { loop: true }

  const SLIDES = [
    {
      id: 1,
      text: 'Tudo o que você precisa, mais perto do que você imagina.',
    },
    { id: 2, text: 'Conectando você às melhores lojas da sua região!' },
    { id: 3, text: 'Ofertas exclusivas para você!' },
  ]

  return (
    <div className="flex min-h-screen w-full border-foreground/5 bg-muted">
      <div className="m-20 grid w-full grid-cols-2 antialiased">
        <div className="relative flex flex-col items-center justify-center bg-white dark:bg-slate-800">
          <Outlet />
        </div>
        <div className="flex h-full flex-col justify-between border-r bg-blue-800 p-10 text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-lg font-semibold">
              <span className="text-orange-500">Kariri</span>.Shop
            </span>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
          <div className="m-10 flex flex-col items-center">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>

          <footer className="text-sm">
            &copy; Kariri.Shop - {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </div>
  )
}
