# Resumify: AI-Powered Resume Builder & Career Assistant

## Introduction

Resumify is a revolutionary AI-powered resume building platform that transforms how professionals create, optimize, and manage their resumes. Built with modern web technologies and powered by advanced AI, Resumify offers seamless integration with Google Docs, Gmail, making it the ultimate career acceleration tool for job seekers.

## 🚀 Key Features

### 🤖 AI-Powered Resume Analysis & Generation
- **Intelligent Resume Review**: Get instant feedback on your resume with advanced AI technology
- **Smart Formatting**: Automatically improve layout and structure for better readability
- **ATS Optimization**: Ensure your resume passes Applicant Tracking Systems
- **Real-time Suggestions**: Receive instant improvements as you chat with the AI assistant
- **Professional Summary Generation**: AI-powered professional summary creation

### 📄 Google Docs Integration
- **Seamless Document Creation**: Generate professional resumes directly in Google Docs
- **ATS-Friendly Templates**: Pre-formatted templates optimized for ATS systems
- **Real-time Collaboration**: Work on resumes with others in Google Docs
- **Document Analysis**: Read and analyze existing Google Docs resumes
- **Professional Formatting**: Automatic formatting with proper margins, fonts, and styling

### 👤 Comprehensive Profile Management
- **Personal Information**: Store and manage contact details, location, and social links
- **Professional Summary**: Create and edit compelling career summaries
- **Work Experience**: Detailed experience tracking with bullet points and achievements
- **Education History**: Complete educational background management
- **Project Portfolio**: Showcase your projects with descriptions
- **Technical Skills**: Organize and categorize your technical abilities
- **Profile Persistence**: All data stored securely in Supabase database

### 📧 Email Integration & Automation
- **Gmail Integration**: Connect your Gmail account for seamless email management
- **Draft Generation**: AI-powered email draft creation for job applications
- **Email Search**: Search through your Gmail for relevant job-related emails
- **Automated Sending**: Send resumes and cover letters directly through Gmail
- **Professional Templates**: Pre-built email templates for different scenarios

### 🔐 Secure Authentication & Data Management
- **Auth0 Integration**: Secure authentication with multiple provider support
- **Google OAuth**: Seamless Google account integration
- **Data Security**: All user data encrypted and securely stored
- **Session Management**: Secure session handling with automatic token refresh

### 🎨 Modern User Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Intuitive Navigation**: Clean, user-friendly interface
- **Real-time Updates**: Live updates as you make changes
- **Accessibility**: Built with accessibility best practices

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.4.5**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Lucide React**: Beautiful icon library

### Backend & AI
- **LangChain**: AI agent framework
- **OpenAI GPT-4o-mini**: Advanced language model
- **Auth0**: Authentication and authorization
- **Supabase**: PostgreSQL database and real-time features
- **Google APIs**: Google Docs and Gmail integration

### Integrations
- **Google Docs API**: Document creation and management
- **Gmail API**: Email composition and management
- **Auth0**: Multi-provider authentication

## 🔐 Auth0 Authentication & Token Exchange Mechanism

The heart of Resumify's security and integration capabilities lies in its sophisticated Auth0 implementation. Here's how the authentication and token exchange system works:

### Auth0 Configuration

```typescript
// src/lib/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server"

// Create an Auth0 Client
export const auth0 = new Auth0Client()

export const getRefreshToken = async () => {
  const session = await auth0.getSession()
  return session?.tokenSet?.refreshToken
}
```

### Middleware Protection

The application uses Next.js middleware to protect routes and handle authentication:

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "./lib/auth0"

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request)

  // Authentication routes — let the Auth0 middleware handle it
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes
  }

  // Allow debug API routes without requiring an app session
  if (request.nextUrl.pathname.startsWith("/api/debug")) {
    return NextResponse.next()
  }

  const { origin } = new URL(request.url)
  const session = await auth0.getSession(request)

  // User does not have a session — redirect to login
  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }
  return authRes
}
```

### Token Exchange for Third-Party Services

One of Resumify's most powerful features is its ability to exchange Auth0 tokens for third-party service tokens:

```typescript
// src/lib/auth0-ai.ts
import { getRefreshToken } from "@/lib/auth0"
import { Auth0AI } from "@auth0/ai-langchain"
import { getAccessTokenForConnection } from "@auth0/ai-langchain"

// Get the access token for a connection via Auth0
export const getAccessToken = async () => getAccessTokenForConnection()

const auth0AI = new Auth0AI()

// Connection for Google services
export const withGoogleConnection = auth0AI.withTokenForConnection({
  connection: "google-oauth2",
  scopes: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.compose",
  ],
  refreshToken: getRefreshToken,
})
```

### API Route Authentication

All API routes are protected and use Auth0 session management:

```typescript
// src/app/api/profile/route.ts
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = session.user.email
    // ... rest of the implementation
  } catch (error) {
    // ... error handling
  }
}
```

### Google Services Integration

The app seamlessly integrates with Google services using Auth0 token exchange:

```typescript
// src/lib/tools/gdocs.ts
export const readGoogleDocContent = tool(
  async ({ docId }) => {
    // Get the Google OAuth token for the user
    const { token } = await auth0.getAccessTokenForConnection({
      connection: "google-oauth2",
    })
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: token })

    const docs = google.docs({ version: "v1", auth })
    // ... rest of the implementation
  }
)
```

### Gmail Integration with Token Exchange

The AI agent can interact with Gmail using Auth0-managed tokens:

```typescript
// src/app/api/chat/route.ts
const gmailParams = {
  credentials: {
    accessToken: getAccessToken,
  },
}

const gmailDraft = new GmailCreateDraft(gmailParams)
const gmailSend = new GmailSendMessage(gmailParams)
const gmailSearch = new GmailSearch(gmailParams)

const agent = createReactAgent({
  llm,
  tools: [
    // ... other tools
    withGoogleConnection(gmailDraft),
    withGoogleConnection(gmailSend),
    withGoogleConnection(gmailSearch),
  ],
})
```

## 🗄️ Database Architecture

Resumify uses Supabase (PostgreSQL) for data persistence with a well-structured schema:

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  email TEXT PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Experience Table
```sql
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES user_profiles(email),
  role TEXT,
  company TEXT,
  duration TEXT,
  bullets TEXT[],
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Education Table
```sql
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES user_profiles(email),
  degree TEXT,
  institution TEXT,
  duration TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES user_profiles(email),
  name TEXT,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Skills Table
```sql
CREATE TABLE skills (
  user_email TEXT PRIMARY KEY REFERENCES user_profiles(email),
  skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🤖 AI Agent Implementation

The AI agent is built using LangChain and integrates seamlessly with all the tools:

```typescript
// src/app/api/chat/route.ts
const AGENT_SYSTEM_TEMPLATE = `You are Resumify, an intelligent and supportive AI agent that helps users create, review, and optimize resumes tailored to specific job descriptions.

Your Capabilities:
- Access and analyze resumes from Google Docs
- Retrieve and update user profile information stored in the database
- Rewrite or generate optimized resumes using Google Docs templates
- Tailor resumes for specific job descriptions provided by the user
- Generate concise email drafts to send resumes to recruiters via Gmail

Your Objectives:
- When users ask about their information, use the getUserProfile tool ONCE to retrieve their stored data
- Provide actionable suggestions for each resume section
- Identify and flag weak entries, missing details, or formatting issues
- Rewrite or reformat text for clarity, impact, and ATS compatibility
- When users want to update their profile, use the saveUserProfile tool to store the information
`

const agent = createReactAgent({
  llm,
  tools: [
    readGoogleDocContent,
    createGoogleDocResume,
    getUserProfile,
    saveUserProfile,
    withGoogleConnection(gmailDraft),
    withGoogleConnection(gmailSend),
    withGoogleConnection(gmailSearch),
  ],
  messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
})
```

## 📱 User Experience Features

### Landing Page Design
The landing page (`LoginPage.tsx`) showcases Resumify's capabilities with:

- **Hero Section**: Compelling headline with gradient text effects
- **Feature Grid**: Six key features with icons and descriptions
- **How It Works**: Five-step process explanation
- **Benefits Section**: Detailed benefits with performance metrics
- **Call-to-Action**: Multiple conversion points throughout the page

### Key Features Highlighted:
1. **AI Resume Analysis**: Connect Google Doc resume for AI optimization
2. **Persistent Profile**: One-time setup with secure data storage
3. **Job-Tailored Resumes**: Customize resumes for specific job descriptions
4. **Email Automation**: Draft and send professional application emails
5. **Google Docs Integration**: Generate ATS-optimized resumes in Google Drive
6. **Real-Time AI Chat**: Interactive AI assistant for resume improvements

## 🔧 API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `GET /auth/logout` - Logout
- `GET /auth/callback` - Auth0 callback

### Profile Management
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile

### AI Chat
- `POST /api/chat` - Chat with AI assistant

### Debug (Development)
- `POST /api/debug/create-doc` - Create test Google Doc resume

## 🛡️ Security Features

- **OAuth 2.0 Authentication**: Secure login with Auth0
- **Token-based Authorization**: JWT tokens for API access
- **Data Encryption**: All sensitive data encrypted at rest
- **CORS Protection**: Configured CORS policies
- **Input Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: Built-in rate limiting for API endpoints

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Auth0 account
- Supabase account
- Google Cloud Console project
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resumify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Auth0 Configuration
   AUTH0_SECRET=your-auth0-secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_CLIENT_SECRET=your-auth0-client-secret

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key

   # Google OAuth (for Google Docs/Gmail integration)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Getting Started
- Sign up or log in using Auth0
- Connect your Google account for Google Docs integration

### 2. Profile Setup
- Navigate to the Profile page
- Fill in your personal information
- Add your professional summary
- Enter your work experience with detailed bullet points
- Add your education history
- List your projects and technical skills
- Save your profile

### 3. AI Chat Assistant
- Use the chat interface to interact with the AI assistant
- Ask for resume suggestions and improvements
- Request specific formatting changes
- Get help with content optimization

### 4. Resume Generation
- Ask the AI to create a new resume using your profile data
- The AI will generate a professional Google Doc resume
- Review and edit the generated resume in Google Docs
- Download or share the resume as needed

### 5. Email Integration
- Connect your Gmail account
- Ask the AI to draft application emails
- Search through your Gmail for job-related emails
- Send resumes and cover letters directly

## 🔮 Future Roadmap

### Upcoming Features
- [ ] Resume templates library
- [ ] Cover letter generation
- [ ] Job application tracking
- [ ] Interview preparation tools
- [ ] LinkedIn profile optimization
- [ ] Resume analytics and insights
- [ ] Multi-language support
- [ ] Team collaboration features

### Recent Updates
- ✅ Google Docs integration
- ✅ Gmail email automation
- ✅ Professional summary feature
- ✅ Profile management system
- ✅ AI-powered resume analysis
- ✅ ATS optimization

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o-mini model
- **Auth0** for authentication services
- **Supabase** for database and real-time features
- **Google** for Docs and Gmail APIs
- **LangChain** for AI agent framework
- **Vercel** for hosting and deployment

---

**Resumify** - Empowering your career journey with AI-powered resume building and optimization. 🚀

## Technical Deep Dive: Auth0 Token Exchange

The most critical aspect of Resumify's architecture is its sophisticated Auth0 token exchange mechanism. This system enables seamless integration with third-party services while maintaining security and user privacy.

### How Token Exchange Works

1. **Initial Authentication**: Users authenticate with Auth0 using OAuth 2.0
2. **Token Storage**: Auth0 securely stores access and refresh tokens
3. **Service Integration**: When accessing Google services, Auth0 exchanges stored tokens for service-specific tokens
4. **Automatic Refresh**: Tokens are automatically refreshed when needed
5. **Secure Access**: All API calls use the exchanged tokens for authentication

### Benefits of This Approach

- **Single Sign-On**: Users authenticate once and access all integrated services
- **Security**: Tokens are managed centrally by Auth0
- **Scalability**: Easy to add new service integrations
- **User Experience**: Seamless integration without multiple login prompts
- **Compliance**: Centralized token management ensures security compliance

This architecture makes Resumify not just a resume builder, but a comprehensive career management platform that integrates with the tools professionals use daily.
