import { Site } from '@/types/site'
import { SiteList } from '../components/site-list'
import { sites } from '@/helpers/siteApi'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
const dbName = process.env.MONGODB_DB

async function getAll() {
  const session = (await getServerSession(authOptions)) as any
  const user = session.user as any

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const siteResponse = collection.find({
      userId: new ObjectId(user._id),
    })

    const sites = await siteResponse.toArray();

    // Convert each object in the array
    const simpleDataArray = sites.map((data) => ({
      _id: data._id.toString() as string, // convert ObjectId to string
      bucketName: data.bucketName as string,
      userId: data.userId.toString() as string, // convert ObjectId to string
      content: data.content as object,
      href: data.href as string,
    }))

    return simpleDataArray as Site[]
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export default async function Sites() {

  let allSites: Site[] = [];

  try {
    allSites = (await getAll()) as Site[]
  } catch (error) {
    console.log(error)
  }

  if (!allSites.length)
    return (
      <div className="">
        <Link href="dashboard" className="bg-purple-600 text-white hover:bg-purple-500 px-4 py-2 rounded-md">
          Generate a new site
        </Link>
      </div>
    )

  return <SiteList sites={allSites} />
}
