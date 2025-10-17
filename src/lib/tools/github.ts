import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { auth0 } from "@/lib/auth0"
import { Octokit } from "@octokit/rest"

export const getGithubRepos = tool(
  async () => {
    const { token } = await auth0.getAccessTokenForConnection({
      connection: "github",
    })

    const octokit = new Octokit({ auth: token })

    const { data } = await octokit.rest.repos.listForAuthenticatedUser()

    return data.map((repo) => repo.name)
  },
  {
    name: "getGithubRepos",
    description: "Returns a list of the user's GitHub repositories.",
    schema: z.object({}),
  }
)
