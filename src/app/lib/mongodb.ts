import { MongoClient } from "mongodb";

// Ensure the MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Updated connection options
const options = {
  
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve value across HMR
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, avoid using a global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  throw error; // Re-throwing the error makes it easier to catch in calling code
}

// Export the MongoClient promise
export default clientPromise;