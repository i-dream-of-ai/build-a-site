import Image from 'next/image'
import AlienInvasion from './alien-invasion'

export const LoadingAlienInvasion = ({
  isLoading = true,
}: {
  isLoading?: boolean
}) => (
  <div
    role="status"
    className="max-w-full animate-pulse border rounded-md p-2 opacity-50"
  >
    <AlienInvasion />
    <span className="sr-only">Loading...</span>
  </div>
)
