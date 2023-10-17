import { ObjectId } from "mongodb";
import { OpenAIModels } from "@/old.types/openai";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export const users = {
  authenticate,
  getAll,
  getById,
  getByEmail,
  create,
  update,
  delete: _delete,
};

const dbName = process.env.MONGODB_DB;

async function authenticate({ email, password }) {
  const client = await clientPromise;
  const userCollection = client.db(dbName).collection("users");

  const user = await userCollection.findOne({ email });
  if (!user) {
    return false;
  }
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    console.error("invalid user password: ", user);
    return false;
  }
  delete user.password;

  return user;
}

async function getAll() {
  const client = await clientPromise;
  const userCollection = client.db(dbName).collection("users");
  return userCollection.find({});
}

async function getById(id) {
  try {
    const client = await clientPromise;
    const userCollection = client.db(dbName).collection("users");
    return await userCollection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(error);
  }
}

async function getByEmail(email) {
  try {
    const client = await clientPromise;
    const userCollection = client.db(dbName).collection("users");
    return await userCollection.findOne({ email });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(error);
  }
}

async function create(params) {
  const client = await clientPromise;
  const userCollection = client.db(dbName).collection("users");

  // validate
  const userExists = await userCollection.findOne({ email: params.email });
  if (userExists) {
    throw new Error('Email "' + params.email + '" is already taken');
  }

  try {
    const data = await userCollection.insertOne({
      name: params.name,
      email: params.email,
      password: bcrypt.hashSync(params.password, 10),
      role: params.email === "kitchenbeats@gmail.com" ? "admin" : "user",
      model: OpenAIModels[process.env.NEXT_PUBLIC_DEFAULT_MODEL],
      openAiKeyAdded: false,
      connectedAccountId: ""
    });
    return {
      _id: data.insertedId,
      name: params.name,
      email: params.email,
      role: params.email === "kitchenbeats@gmail.com" ? "admin" : "user",
      model: OpenAIModels[process.env.NEXT_PUBLIC_DEFAULT_MODEL],
      openAiKeyAdded: false,
      connectedAccountId: "",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error);
  }
}

async function update(id, params) {
  const client = await clientPromise;
  const userCollection = client.db(dbName).collection("users");

  try {
    const updateObject = {};

    if (params.email) {
      updateObject.email = params.email;
      updateObject.role = params.email === "kitchenbeats@gmail.com" ? "admin" : "user";
    }

    if (params.customerId) {
      updateObject.customerId = params.customerId;
    }

    if (params.hasOwnProperty("openAiKeyAdded")) {
      updateObject.openAiKeyAdded = params.openAiKeyAdded;
    }

    if (params.hasOwnProperty("connectedAccountId")) {
      updateObject.connectedAccountId = params.connectedAccountId;
    }

    const result = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateObject },
      { returnDocument: "after" }
    );

    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error);
  }
}

async function _delete(id) {
  const client = await clientPromise;
  const userCollection = client.db(dbName).collection("users");
  return await userCollection.deleteOne({ _id: id });
}
