export function ListSkeleton() {
  return (
    <div
      role="status"
      className="p-4 space-y-4 border divide-y rounded shadow animate-pulse divide-gray-700 md:p-6 border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 rounded-full bg-gray-700"></div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 rounded-full bg-gray-700"></div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 rounded-full bg-gray-700"></div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 rounded-full bg-gray-700"></div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 rounded-full bg-gray-700"></div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
