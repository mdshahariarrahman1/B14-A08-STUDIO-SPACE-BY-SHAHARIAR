import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient, mongoDb } from "@/lib/mongodb";

export const auth = betterAuth({
  baseUrl: process.env.BETTER_AUTH_URL as string,
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
  }),
});