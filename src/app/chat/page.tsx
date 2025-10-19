import Chat from "@/components/Chat"
import { auth0 } from "@/lib/auth0"

async function generateAccountLinkingHref(requested_connection: string) {
  "use server"
  const session = await auth0.getSession()
  const id_token_hint = session!.tokenSet!.idToken!
  const authParams = new URLSearchParams({
    scope: "link_account openid profile offline_access",
    requested_connection,
    id_token_hint,
  }).toString()

  return `/auth/login?${authParams}`
}

export default async function Index() {
  const session = await auth0.getSession()
  
  // Extract user profile from session
  const userProfile = session?.user ? {
    email: session.user.email || "",
    name: session.user.name,
    picture: session.user.picture
  } : undefined

  return (
    <Chat 
      githubUrl={await generateAccountLinkingHref("github")} 
      userProfile={userProfile}
    />
  )
}