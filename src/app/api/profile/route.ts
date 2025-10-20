// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"
import { supabase } from "@/lib/supabase"

// Set max listeners to prevent memory leak warnings
process.setMaxListeners(20)

// GET - Retrieve user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

     // Transform data to match frontend expectations
     const responseData = {
       profile: profile ? {
         email: profile.email,
         full_name: profile.full_name || "",
         phone: profile.phone || "",
         location: profile.location || "",
         linkedin: profile.linkedin || "",
         github: profile.github || "",
         summary: profile.summary || "", // NEW: Include summary
       } : { 
         email, 
         full_name: "", 
         phone: "", 
         location: "", 
         linkedin: "", 
         github: "",
         summary: "", // NEW: Include empty summary for new users
       },
       experience: experience || [],
       education: education || [],
       projects: projects || [],
       skills: skills?.skills || [],
     }

     return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// POST - Create or update user profile
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = session.user.email
    const body = await req.json()

    const { profile, experience, education, projects, skills } = body

     // Upsert profile
     if (profile) {
       const { error: profileError } = await supabase
         .from('user_profiles')
         .upsert(
           {
             email,
             full_name: profile.full_name,
             phone: profile.phone,
             location: profile.location,
             linkedin: profile.linkedin || "",
             github: profile.github || "",
             summary: profile.summary || "", // NEW: Save summary field
             updated_at: new Date().toISOString(),
           },
           {
             onConflict: 'email'
           }
         )

       if (profileError) throw profileError
     }

    // Update experience
    if (experience) {
      // Delete existing experience
      await supabase
        .from('experience')
        .delete()
        .eq('user_email', email)

      // Insert new experience
      if (experience.length > 0) {
        const expData = experience.map((exp: any, idx: number) => ({
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

    // Update education
    if (education) {
      await supabase
        .from('education')
        .delete()
        .eq('user_email', email)

      if (education.length > 0) {
        const eduData = education.map((edu: any, idx: number) => ({
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

    // Update projects
    if (projects) {
      await supabase
        .from('projects')
        .delete()
        .eq('user_email', email)

      if (projects.length > 0) {
        const projData = projects.map((proj: any, idx: number) => ({
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

    // Update skills
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    )
  }
}