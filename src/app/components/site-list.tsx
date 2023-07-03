'use client'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { IconDotsVertical } from '@tabler/icons-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { Site } from '@/types/site'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export interface SitesProps {
  sites: Site[]
}

export function SiteList({ sites: siteList }: SitesProps) {
  const [sites, setSites] = useState(siteList)

  async function deleteSite(id: string) {
    const response = await fetch(`/api/sites/${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      toast.error('There was an error while deleting you site.')
      console.error(data)
    }
    toast.success('Site deleted!')
    await getSites()
    return data
  }

  async function getSites() {
    try {
      const response = await fetch('/api/sites')
      const data = await response.json()

      console.log('data', data)
      if (!response.ok) {
        toast.error('There was an error while getting your sites.')
        console.error(data.sites)
      }

      setSites(data.sites)
    } catch (error) {
      toast.error('There was an error while getting your sites.')
      console.error(error)
    }
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
              <p className="text-sm font-semibold leading-6 text-neutral-300">
                {site.content.title}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">Deployed on</p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <a
              href={site.href}
              target="_blank"
              className="hidden rounded-md bg-purple-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-purple-800 hover:bg-purple-500 sm:block"
            >
              View site<span className="sr-only">, {site.bucketName}</span>
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={`/sites/${site._id}`}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900',
                        )}
                      >
                        Edit<span className="sr-only">, {site.bucketName}</span>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => deleteSite(site._id)}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900',
                        )}
                      >
                        Delete
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
