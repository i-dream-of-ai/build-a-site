import { getServerSession } from 'next-auth'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Site } from '@/types/site'

export const runtime = 'edge'

export const sites = {
  getAll,
  // getById,
  // create,
  // update,
  // delete: _delete
}

const dbName = process.env.MONGODB_DB

async function getAll() {
  const session = (await getServerSession(authOptions)) as any
  const user = session.user as any

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const siteResponse = await collection.find({
      userId: new ObjectId(user._id),
    })
    const sites = await siteResponse.toArray()

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
