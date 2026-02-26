'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';

const USERS_KEY = 'users';

export function useUsers() {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: () => usersApi.getUsers(),
  });
}
