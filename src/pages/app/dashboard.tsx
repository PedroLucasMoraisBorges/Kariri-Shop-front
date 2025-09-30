import { Pagination } from '@/components/ui/pagination'

export function Dashboard() {
  return (
    <div>
      <h1>Está na pagina Dashboard sem Login</h1>
      <Pagination pageIndex={0} totalCount={105} perPage={10} />
    </div>
  )
}
