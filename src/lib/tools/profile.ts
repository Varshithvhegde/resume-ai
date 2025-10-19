// lib/tools/profile.ts
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { auth0 } from "@/lib/auth0"

// Set max listeners to prevent memory leak warnings
process.setMaxListeners(20)

export const getUserProfile = tool(
  async () => {
    // Get the current user's email from Auth0
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      throw new Error("User not authenticated")
    }

    const email = session.user.email

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    // Fetch experience
    const { data: experience, error: expError } = await supabase
      .from('experience')
      .select('*')
      .eq('user_email', email)
      .order('order_index', { ascending: true })

    if (expError) throw expError

    // Fetch education
    const { data: education, error: eduError } = await supabase
      .from('education')
      .select('*')
      .eq('user_email', email)
      .order('order_index', { ascending: true })

    if (eduError) throw eduError

    // Fetch projects
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_email', email)
      .order('order_index', { ascending: true })

    if (projError) throw projError

    // Fetch skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .eq('user_email', email)
      .single()

    if (skillsError && skillsError.code !== 'PGRST116') {
      throw skillsError
    }

    return {
      profile: profile || { email },
      experience: experience || [],
      education: education || [],
      projects: projects || [],
      skills: skills?.skills || [],
    }
  },
  {
    name: "getUserProfile",
    description:
      "Retrieves the complete profile information of the current logged-in user including personal details, work experience, education, projects, and skills. Use this tool whenever you need to access user's resume information to provide suggestions, create a resume, or answer questions about their profile.",
    schema: z.object({}),
  }
)

export const saveUserProfile = tool(
  async ({ profile, experience, education, projects, skills }) => {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      throw new Error("User not authenticated")
    }

    const email = session.user.email

     // Upsert profile if provided
     if (profile) {
       const { error: profileError } = await supabase
         .from('user_profiles')
         .upsert({
           email,
           full_name: profile.full_name,
           phone: profile.phone,
           location: profile.location,
           linkedin: profile.linkedin_url,
           github: profile.github_url,
           updated_at: new Date().toISOString(),
         })

       if (profileError) throw profileError
     }

    // Update experience if provided
    if (experience) {
      await supabase
        .from('experience')
        .delete()
        .eq('user_email', email)

      if (experience.length > 0) {
        const expData = experience.map((exp: { role: string; company: string; duration: string; bullets: string[] }, idx: number) => ({
          user_email: email,
          role: exp.role,
          company: exp.company,
          duration: exp.duration,
          bullets: exp.bullets,
          order_index: idx,
        }))

        const { error: expError } = await supabase
          .from('experience')
          .insert(expData)

        if (expError) throw expError
      }
    }

    // Update education if provided
    if (education) {
      await supabase
        .from('education')
        .delete()
        .eq('user_email', email)

      if (education.length > 0) {
        const eduData = education.map((edu: { degree: string; institution: string; duration: string }, idx: number) => ({
          user_email: email,
          degree: edu.degree,
          institution: edu.institution,
          duration: edu.duration,
          order_index: idx,
        }))

        const { error: eduError } = await supabase
          .from('education')
          .insert(eduData)

        if (eduError) throw eduError
      }
    }

    // Update projects if provided
    if (projects) {
      await supabase
        .from('projects')
        .delete()
        .eq('user_email', email)

      if (projects.length > 0) {
        const projData = projects.map((proj: { name: string; description: string }, idx: number) => ({
          user_email: email,
          name: proj.name,
          description: proj.description,
          order_index: idx,
        }))

        const { error: projError } = await supabase
          .from('projects')
          .insert(projData)

        if (projError) throw projError
      }
    }

    // Update skills if provided
    if (skills) {
      const { error: skillsError } = await supabase
        .from('skills')
        .upsert(
          {
            user_email: email,
            skills,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_email'
          }
        )

      if (skillsError) throw skillsError
    }

    return "Profile updated successfully"
  },
  {
    name: "saveUserProfile",
    description:
      "Saves or updates the user's profile information in the database. You can update specific sections (profile, experience, education, projects, skills) or all at once. Only provide the sections you want to update.",
    schema: z.object({
       profile: z
         .object({
           full_name: z.string(),
           phone: z.string(),
           location: z.string(),
           linkedin_url: z.string().url(),
           github_url: z.string().url(),
         })
         .optional()
         .describe("Personal information of the user"),
      experience: z
        .array(
          z.object({
            role: z.string(),
            company: z.string(),
            duration: z.string(),
            bullets: z.array(z.string()),
          })
        )
        .optional()
        .describe("Work experience entries"),
      education: z
        .array(
          z.object({
            degree: z.string(),
            institution: z.string(),
            duration: z.string(),
          })
        )
        .optional()
        .describe("Education entries"),
      projects: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
          })
        )
        .optional()
        .describe("Project entries"),
      skills: z
        .array(z.string())
        .optional()
        .describe("List of technical skills"),
    }),
  }
)