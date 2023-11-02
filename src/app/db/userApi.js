import { ObjectId } from "mongodb";
import { OpenAIModels } from "@/old.types/openai";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';



const dbName = process.env.MONGODB_DB;
const emailFrom = process.env.EMAIL_FROM;
const emailSubject = process.env.EMAIL_SUBJECT;
const emailText = process.env.EMAIL_CONTENT_TXT;
const domain = process.env.NEXT_PUBLIC_APP_URL;

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

async function saveToken(email){
  const token = generateUniqueToken();
  const client = await clientPromise;
  const userCollection = client.db(dbName).collection("users");
  const filter = { email: email };
  const update = { $set: { resetToken: token, resetTokenExp: Date.now() + 3600000 } }; // token will expire in 1 hour
  await userCollection.updateOne(filter, update, { upsert: true });

  // Setup SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Email content
  const msg = {
    to: email,
    from: emailFrom,
    subject: emailSubject,
    text: `${emailText}${domain}/verify?email=${email}&token=${token}`,
    html: `<strong>${emailText}</strong><br><br><a href="${domain}/verify?email=${email}&token=${token}">Reset Password</a>`,
  };

  // Send email
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(`Email sending failed: ${error}`);
  }
}

function generateUniqueToken() {
  return crypto.randomBytes(32).toString('hex');
}

export const updatePassword = async (email, token, newpassword) => {
  const client = await clientPromise;

  const database = client.db(dbName);
  const users = database.collection("users");

  // Find the user with the given email and token
  const user = await users.findOne({ email, resetToken: token });

  if (!user) {
    throw new Error("Invalid email or token");
  }

  // Check if the token has expired
  if (user.resetTokenExp < Date.now()) {
    throw new Error("Token has expired");
  }

  // Hash the new password before updating it
  const hashedPassword = await bcrypt.hash(newpassword, 10);

  // Update the user's password with the hashed password and remove resetToken and resetTokenExp
  const result = await users.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExp: "" }
      }
  );

  if (result.modifiedCount !== 1) {
    throw new Error("Failed to update password");
  }

  return "/login";
};

export const users = {
  authenticate,
  getAll,
  getById,
  getByEmail,
  create,
  update,
  delete: _delete,
  saveToken,
  updatePassword,
};
