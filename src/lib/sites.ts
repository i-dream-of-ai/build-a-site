import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Site } from '@/old.types/site'

export const fetchSite = async (id: string): Promise<Site> => {
  try {
    const res = await fetch(`/api/sites/${id}`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return await res.json()
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch site: ${error.message}`)
    }
    throw error
  }
}

export const fetchSites = async (): Promise<Site[]> => {
  try {
    const res = await fetch(`/api/sites`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await res.json()
    return data.sites
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch sites: ${error.message}`)
    }
    throw error
  }
}

export const fetchAllSites = async (): Promise<Site[]> => {
  try {
    const res = await fetch(`/api/sites/all`)
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await res.json()
    return data.sites
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch sites: ${error.message}`)
    }
    throw error
  }
}

const updateSite = async ({
  id,
  updates,
}: {
  id: string
  updates: Site
}): Promise<Site> => {
  try {
    const res = await fetch(`/api/sites/${id}`, {
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
      throw new Error(`Failed to update site: ${error.message}`)
    }
    throw error
  }
}

const deleteSite = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`/api/sites/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete site: ${error.message}`)
    }
    throw error
  }
}

export const useSite = (id: string, enabled: boolean) => {
  return useQuery<Site, Error>(
    ['sites', id],
    () => {
      return fetchSite(id)
    },
    {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error(`Error fetching site: ${error.message}`)
        }
      },
      enabled,
    },
  )
}

export const useSites = ({type="user"}) => {
  return useQuery<Site[], Error>(
    ['sites'],
    () => {
      if(type === "all"){
        return fetchAllSites()
      } else {
        return fetchSites()
      }
    },
    {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error(`Error fetching site: ${error.message}`)
        }
      },
    },
  )
}

export const useUpdateSite = () => {
  const queryClient = useQueryClient()
  return useMutation<
    Site,
    Error,
    { id: string; updates: Site },
    { previousSite: Site | undefined }
  >(updateSite, {
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries(['sites', id])
      const previousSite = queryClient.getQueryData<Site>(['sites', id])
      queryClient.setQueryData(['sites', id], { ...previousSite, ...updates })
      return { previousSite }
    },
    onError: (error, variables, context) => {
      if (context?.previousSite) {
        queryClient.setQueryData(
          ['sites', context.previousSite._id],
          context.previousSite,
        )
      }
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries(['sites', id])
    },
  })
}

export const useDeleteSite = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>(deleteSite, {
    onSuccess: (data, id) => {
      //refresh sites list
      queryClient.invalidateQueries(['sites'])
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error(`Error deleting site: ${error.message}`)
      }
    },
  })
}
