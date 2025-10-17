import { Auth0Client } from "@auth0/nextjs-auth0/server"

// Create an Auth0 Client.
export const auth0 = new Auth0Client()

export const getRefreshToken = async () => {
  const session = await auth0.getSession()
  return session?.tokenSet?.refreshToken
}
