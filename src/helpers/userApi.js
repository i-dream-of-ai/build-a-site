import bcrypt from 'bcryptjs'
import clientPromise from '@/app/lib/mongodb'
import { OpenAIModels } from '@/old.types/openai'

export const users = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
}

const dbName = process.env.MONGODB_DB

async function authenticate({ email, password }) {
  const client = await clientPromise
  const userCollection = client.db(dbName).collection('users')

  const user = await userCollection.findOne({ email })
  if (!user) {
    return false
  }
  const isValidPassword = bcrypt.compareSync(password, user.password)
  if (!isValidPassword) {
    console.error('invalid user password: ', user)
    return false
  }
  delete user.password

  return user
}

async function getAll() {
  const client = await clientPromise
  const userCollection = client.db(dbName).collection('users')
  return userCollection.find({})
}

async function getById(id) {
  const client = await clientPromise
  const userCollection = client.db(dbName).collection('users')
  return await userCollection.findOne({ _id: id })
}

async function create(params) {
  const client = await clientPromise
  const userCollection = client.db(dbName).collection('users')

  // validate
  const userExists = await userCollection.findOne({ email: params.email })
  if (userExists) {
    throw new Error('Email "' + params.email + '" is already taken')
  }

  try {
    const result = await userCollection.insertOne({
      email: params.email,
      password: bcrypt.hashSync(params.password, 10),
      role: params.email === 'kitchenbeats@gmail.com' ? 'admin' : 'user',
      model: OpenAIModels[process.env.NEXT_PUBLIC_DEFAULT_MODEL],
    })
    return result
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error(error)
  }
}

async function update(id, params) {
  const client = await clientPromise
  const userCollection = client.db(dbName).collection('users')

  const user = await userCollection.findOne({ _id: id })

  try {
    // validate
    if (!user) throw 'User not found'
    if (
      user.email !== params.email &&
      (await userCollection.findOne({ email: params.email }))
    ) {
      throw 'Email "' + params.email + '" is already taken'
    }

    // hash password if it was entered
    if (params.password) {
      params.hash = bcrypt.hashSync(params.password, 10)
    }

    // copy params properties to user
    Object.assign(user, params)

    const result = await userCollection.updateOne({
      email: params.email,
      password: params.password,
      role: params.email === 'kitchenbeats@gmail.com' ? 'admin' : 'user',
    })

    return result
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error(error)
  }
}

async function _delete(id) {
  const client = await clientPromise
  const userCollection = client.db(dbName).collection('users')
  return await userCollection.deleteOne({ _id: id })
}
