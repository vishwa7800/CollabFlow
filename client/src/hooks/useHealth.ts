import { useQuery } from '@tanstack/react-query'
import { healthApi } from '@/lib/api'

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.check(),
    retry: 1,
    staleTime: 10000,
  })
}
