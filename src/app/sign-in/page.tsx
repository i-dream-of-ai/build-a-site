import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SigninForm from "../components/signin-form";

export default async function SignIn() {

  let session
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error(error)
  }
  
  if (session) {
    redirect('/dashboard');
  } else {
    return (
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <SigninForm />
        </div>
      </div>
    )
  }
  
}