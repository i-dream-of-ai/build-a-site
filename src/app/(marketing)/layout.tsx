import React from 'react'
import NavBar from '../components/(marketing)/navbar'

export const metadata = {
  title: 'Dashboard',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
    <NavBar />
    <div className="mx-auto max-w-4xl py-20 px-4 sm:px-6 lg:px-8">
      <div className='bg-black rounded-lg p-8'>{children}</div>
    </div>
    </>
  )
}
