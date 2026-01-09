import { useQuery } from '@tanstack/react-query';
import { fetchMapData } from './api';

export function useMapData() {
  return useQuery({
    queryKey: ['mapData'],
    queryFn: fetchMapData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
