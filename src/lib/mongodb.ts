import { MongoClient } from "mongodb";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is required to access the StudioSpace database.");
}

export const mongoClient = new MongoClient(mongoUrl);
export const mongoDb = mongoClient.db("studio_Space");
