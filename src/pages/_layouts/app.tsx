/*
Basicamente, o Outlet é o componente que vai especificar o conteúdo de cada página. 
Exemplo abaixo, o cabeçalho vai se repetir em todas as páginas, mas o conteúdo onde o Outlet está vai ser o dinâmico.
 */
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/header/header'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  )
}
