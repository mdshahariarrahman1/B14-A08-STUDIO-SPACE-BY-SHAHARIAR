import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient, mongoDb } from "@/lib/mongodb";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : [],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/sign-in/social": { window: 60, max: 10 },
    },
  },
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET as string,
    },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
        issuer: process.env.BETTER_AUTH_URL,
        audience:
          process.env.JWT_AUDIENCE || process.env.BETTER_AUTH_URL,
      },
      disableSettingJwtHeader: true,
    }),
  ],

  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
  }),
});