import { Pagination } from '@/components/ui/pagination'

export function DashboardCompany() {
  return (
    <div>
      <h1>Está na pagina Dashboard Company</h1>
      <Pagination pageIndex={0} totalCount={105} perPage={10} />
    </div>
  )
}
