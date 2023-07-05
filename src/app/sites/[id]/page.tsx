import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import SiteForm from '@/app/components/site-form'
import { Site } from '@/types/site'

const dbName = process.env.MONGODB_DB

async function getData(id: string) {
  
  const session = (await getServerSession(authOptions)) as any
  const user = session.user as any

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const siteResponse = await collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user._id),
    })

    if (!siteResponse) return false

    // Convert each object in the array
    const site = {
      _id: siteResponse._id.toString() as string, // convert ObjectId to string
      bucketName: siteResponse.bucketName as string,
      userId: siteResponse.userId.toString() as string, // convert ObjectId to string
      content: siteResponse.content as object,
      href: siteResponse.href as string,
    }

    return site
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export default async function Sites({
  params: { id },
}: {
  params: { id: string }
}) {
  let site
  try {
    site = (await getData(id)) as Site
  } catch (error) {
    console.error(error)
  }

  if (!site) return null

  return <SiteForm site={site} />
}
