import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { User, UserUpdates } from '@/old.types/user'
import { toast } from 'react-hot-toast'

export const fetchProfile = async (id: string): Promise<User> => {
  try {
    const res = await fetch(`/api/user/${id}`)
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message)
    }
    return response;

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }
    throw error
  }
}

const updateUser = async ({
  id,
  updates,
}: {
  id: string
  updates: UserUpdates
}): Promise<User> => {
  try {
    const res = await fetch(`/api/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
    throw error
  }
}

const deleteUser = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`/api/user/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
    throw error
  }
}

export const useUserProfile = (id: string, enabled: boolean) => {
  return useQuery<User, Error>(
    ['userProfile', id],
    () => {
      return fetchProfile(id)
    },
    {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error(`Error fetching user profile: ${error.message}`)
        }
      },
      enabled,
    },
  )
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation<
    User,
    Error,
    { id: string; updates: UserUpdates },
    { previousUser: User | undefined }
  >(updateUser, {
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries(['userProfile', id])
      const previousUser = queryClient.getQueryData<User>(['userProfile', id])
      queryClient.setQueryData(['userProfile', id], {
        ...previousUser,
        ...updates,
      })
      return { previousUser }
    },
    onError: (error, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(
          ['userProfile', context.previousUser._id],
          context.previousUser,
        )
      }
      toast.error('There was an error while updating your profile.')
    },
    onSuccess: () => {
      toast.success('Profile updated successfully.')
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries(['userProfile', id])
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>(deleteUser, {
    onSuccess: (data, id) => {
      queryClient.invalidateQueries(['userProfile', id])
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error(`Error deleting user: ${error.message}`)
      }
    },
  })
}
