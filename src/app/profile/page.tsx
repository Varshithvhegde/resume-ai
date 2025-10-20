"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, Save, LogOut, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface Experience {
  role: string
  company: string
  duration: string
  bullets: string[]
}

interface Education {
  degree: string
  institution: string
  duration: string
}

interface Project {
  name: string
  description: string
}

interface ProfileData {
  profile: {
    email: string
    full_name: string
    phone: string
    location: string
    linkedin: string
    github: string
    summary: string // NEW
  }
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: string[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    profile: {
      email: "",
      full_name: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      summary: "", // NEW
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      setProfileData(data)
    } catch (_error: unknown) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (!res.ok) throw new Error("Failed to save profile")

      toast({
        title: "Success",
        description: "Profile saved successfully",
      })
    } catch (_error: unknown) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addExperience = () => {
    setProfileData({
      ...profileData,
      experience: [
        ...profileData.experience,
        { role: "", company: "", duration: "", bullets: [""] },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const newExp = profileData.experience.filter((_, i) => i !== index)
    setProfileData({ ...profileData, experience: newExp })
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...profileData.experience]
    newExp[index] = { ...newExp[index], [field]: value }
    setProfileData({ ...profileData, experience: newExp })
  }

  const addBullet = (expIndex: number) => {
    const newExp = [...profileData.experience]
    newExp[expIndex].bullets.push("")
    setProfileData({ ...profileData, experience: newExp })
  }

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newExp = [...profileData.experience]
    newExp[expIndex].bullets[bulletIndex] = value
    setProfileData({ ...profileData, experience: newExp })
  }

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const newExp = [...profileData.experience]
    newExp[expIndex].bullets = newExp[expIndex].bullets.filter((_, i) => i !== bulletIndex)
    setProfileData({ ...profileData, experience: newExp })
  }

  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [...profileData.education, { degree: "", institution: "", duration: "" }],
    })
  }

  const removeEducation = (index: number) => {
    const newEdu = profileData.education.filter((_, i) => i !== index)
    setProfileData({ ...profileData, education: newEdu })
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...profileData.education]
    newEdu[index] = { ...newEdu[index], [field]: value }
    setProfileData({ ...profileData, education: newEdu })
  }

  const addProject = () => {
    setProfileData({
      ...profileData,
      projects: [...profileData.projects, { name: "", description: "" }],
    })
  }

  const removeProject = (index: number) => {
    const newProj = profileData.projects.filter((_, i) => i !== index)
    setProfileData({ ...profileData, projects: newProj })
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProj = [...profileData.projects]
    newProj[index] = { ...newProj[index], [field]: value }
    setProfileData({ ...profileData, projects: newProj })
  }

  const updateSkills = (value: string) => {
    const skillsArray = value.split(",").map((s) => s.trim()).filter(Boolean)
    setProfileData({ ...profileData, skills: skillsArray })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 dark:text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveProfile} disabled={saving} className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900">
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Profile
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                asChild
              >
                <a href="/auth/logout" aria-label="Logout" title="Logout">
                  <LogOut className="w-5 h-5 text-gray-900 dark:text-white" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Personal Information */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your basic contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                  Full Name
                </label>
                <Input
                  value={profileData.profile.full_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, full_name: e.target.value },
                    })
                  }
                  placeholder="John Doe"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                  Phone
                </label>
                <Input
                  value={profileData.profile.phone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, phone: e.target.value },
                    })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                  Location
                </label>
                <Input
                  value={profileData.profile.location}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, location: e.target.value },
                    })
                  }
                  placeholder="San Francisco, CA"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                  LinkedIn
                </label>
                <Input
                  value={profileData.profile.linkedin}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/johndoe"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                  GitHub
                </label>
                <Input
                  value={profileData.profile.github}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      profile: { ...profileData.profile, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/johndoe"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEW: Professional Summary Section */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Professional Summary</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              A brief overview of your professional background and career objectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={profileData.profile.summary}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  profile: { ...profileData.profile, summary: e.target.value },
                })
              }
              placeholder="e.g., Experienced software engineer with 5+ years specializing in full-stack development. Passionate about building scalable web applications and leading cross-functional teams..."
              rows={6}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Tip: Keep it concise (2-4 sentences) and highlight your key strengths and goals
            </p>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Work Experience</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your professional work history
                </CardDescription>
              </div>
              <Button onClick={addExperience} size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:bg-gray-100 hover:bg-gray-100 hover:text-white dark:hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.experience.map((exp, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 dark:text-white">Experience {index + 1}</h4>
                  <Button
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    placeholder="Role/Position"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    placeholder="Company"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                  <Input
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                    placeholder="Jan 2020 - Present"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Responsibilities</label>
                    <Button onClick={() => addBullet(index)} size="sm" variant="ghost" className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Bullet
                    </Button>
                  </div>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2 mb-2">
                      <Textarea
                        value={bullet}
                        onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                        placeholder="Describe your achievement or responsibility"
                        rows={2}
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                      />
                      <Button
                        onClick={() => removeBullet(index, bulletIndex)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Education</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your educational background
                </CardDescription>
              </div>
              <Button onClick={addEducation} size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:bg-gray-100 hover:bg-gray-100 hover:text-white dark:hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 dark:text-white">Education {index + 1}</h4>
                  <Button
                    onClick={() => removeEducation(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    placeholder="Degree"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    placeholder="Institution"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                  <Input
                    value={edu.duration}
                    onChange={(e) => updateEducation(index, "duration", e.target.value)}
                    placeholder="2016 - 2020"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Projects</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your notable projects
                </CardDescription>
              </div>
              <Button onClick={addProject} size="sm" variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:bg-gray-100 hover:bg-gray-100 hover:text-white dark:hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.projects.map((proj, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 dark:text-white">Project {index + 1}</h4>
                  <Button
                    onClick={() => removeProject(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={proj.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  placeholder="Project Name"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
                <Textarea
                  value={proj.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  placeholder="Brief description of the project"
                  rows={3}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Technical Skills</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your skills separated by commas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={profileData.skills.join(", ")}
              onChange={(e) => updateSkills(e.target.value)}
              placeholder="JavaScript, React, Node.js, Python, AWS"
              rows={4}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            />
          </CardContent>
        </Card>

        {/* Bottom Save Button */}
        <div className="flex justify-center pb-4">
          <Button onClick={saveProfile} disabled={saving} className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 w-full max-w-xs">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  )
}