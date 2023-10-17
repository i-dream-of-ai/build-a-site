import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'

export const conversations = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
}

const dbName = process.env.MONGODB_DB
export const runtime = 'edge'

async function getAll() {
  const client = await clientPromise
  const collection = client.db(dbName).collection('conversations')
  return await collection.find({})
}

async function getById(id) {
  const client = await clientPromise
  const collection = client.db(dbName).collection('conversations')
  const conversation = await collection.findOne({ _id: new ObjectId(id) })
  return conversation
}

async function create(params) {
  const client = await clientPromise
  const collection = client.db(dbName).collection('conversations')

  // validate
  const exists = await collection.findOne({ _id: new ObjectId(id) })
  if (exists) {
    throw new Error('Conversation already exists.')
  }

  try {
    const result = await collection.insertOne({
      userId: new ObjectId(''),
      messages: messages,
      model: params.model,
    })
    return result
  } catch (error) {
    console.error('Error creating conversation:', error)
    throw new Error(error)
  }
}

async function update(params) {
  const client = await clientPromise
  const collection = client.db(dbName).collection('conversations')

  try {
    const filter = {
      _id: new ObjectId(params.id),
      userId: new ObjectId(params.userId),
    }
    const update = {
      $set: {
        system: params.system,
        model: params.model,
        messages: params.messages,
      },
    }
    const options = {
      upsert: true,
      returnDocument: 'after',
    }

    const result = await collection.findOneAndUpdate(filter, update, options)

    if (result.value) {
      return result.value
    } else {
      console.error(
        'Conversation not found or user not authorized to update it.',
      )
      throw new Error(result)
    }
  } catch (error) {
    console.error('Error updating conversation:', error)
    throw new Error(error)
  }
}

async function _delete(id) {
  const client = await clientPromise
  const collection = client.db(dbName).collection('conversations')
  return await collection.deleteOne({ _id: new ObjectId(id) })
}
