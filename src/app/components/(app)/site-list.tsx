'use client'

import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  IconDotsVertical,
  IconExternalLink,
  IconPencil,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import { ListSkeleton } from '@/ui/list-skeleton'

import { useDeleteSite, useSites } from '@/lib/sites'

export function SiteList({type = "user"}) {
  const { data: sites = [], isLoading, isError } = useSites({type})

  const deleteSiteMutation = useDeleteSite()

  const [isDeleting, setIsDeleting] = useState(false)

  const deleteSite = async (id: string, name: string) => {
    setIsDeleting(true)
    const ok = confirm(`Are you sure you want to delete ${name}?`)
    if (!ok) {
      setIsDeleting(false)
      return
    }
    deleteSiteMutation.mutate(id)
    setIsDeleting(false)
  }

  if (isLoading) return <ListSkeleton />

  if (!sites?.length && !isLoading) {
    return (
      <div className="">
        <Link
          href="dashboard"
          className="bg-purple-600 text-white hover:bg-purple-500 px-4 py-2 rounded-md"
        >
          Generate a new site
        </Link>
      </div>
    )
  }

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {sites.map((site) => (
        <li
          key={site._id}
          className="flex items-center justify-between gap-x-6 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-lg font-semibold leading-6 text-neutral-400">
                {site.content.title}
              </p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            
            <Link
              href={`/sites/${site._id}`}
              className="flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-purple-800 hover:bg-purple-500 gap-1 w-24 justify-center"
            >
              <span>Edit</span> <IconPencil className="h-5 w-5" />{' '}
              <span className="sr-only">, {site.bucketName}</span>
            </Link>
            <a
              href={site.href}
              target="_blank"
              className="flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-purple-800 hover:bg-purple-500 gap-1 w-24 justify-center"
            >
              <span>View</span> <IconExternalLink className="h-5 w-5" />{' '}
              <span className="sr-only">, {site.bucketName}</span>
            </a>
            <Menu as="div" className="relative flex-none">
              <Menu.Button className="-m-2.5 block p-2.5 text-purple-400 hover:text-purple-700">
                <span className="sr-only">Open options</span>
                <IconDotsVertical className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white p-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => deleteSite(site._id, site.content.title)}
                        className="disabled:opacity-40 disabled:cursor-wait rounded-md flex items-center justify-center gap-1 px-2 py-1 text-sm leading-6 text-white bg-red-600 w-full hover:bg-red-500"
                      >
                        Delete <IconX className="w-5 h-5" />
                        <span className="sr-only">, {site.bucketName}</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  )
}
