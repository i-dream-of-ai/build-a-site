import ResetForm from "@/app/components/(marketing)/reset-form.tsx";

export const dynamic = 'force-dynamic'

export default async function Verify() {

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <ResetForm />
      </div>
    </div>
  )
}
