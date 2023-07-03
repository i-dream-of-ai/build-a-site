import React from 'react'

export const metadata = {
  title: 'Dashboard',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-9">
      <div>{children}</div>
    </div>
  )
}
