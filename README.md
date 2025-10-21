# Resumify - AI-Powered Resume Builder & Career Assistant

Resumify is an intelligent, AI-powered resume building platform that helps users create, optimize, and manage professional resumes with advanced features including Google Docs integration, profile management, and automated email capabilities.

## 🚀 Features

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
- **GitHub Integration**: Connect GitHub account for repository access
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
- **GitHub API**: Repository access and management
- **Auth0**: Multi-provider authentication

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

4. **Database Setup**
   Set up the following tables in your Supabase database:
   ```sql
   -- User profiles table
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

   -- Experience table
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

   -- Education table
   CREATE TABLE education (
     id SERIAL PRIMARY KEY,
     user_email TEXT REFERENCES user_profiles(email),
     degree TEXT,
     institution TEXT,
     duration TEXT,
     order_index INTEGER,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Projects table
   CREATE TABLE projects (
     id SERIAL PRIMARY KEY,
     user_email TEXT REFERENCES user_profiles(email),
     name TEXT,
     description TEXT,
     order_index INTEGER,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Skills table
   CREATE TABLE skills (
     user_email TEXT PRIMARY KEY REFERENCES user_profiles(email),
     skills TEXT[],
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Getting Started
- Sign up or log in using Auth0
- Connect your Google account for Google Docs integration
- Optionally connect your GitHub account

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

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with static export
- **Railway**: Full-stack deployment support
- **AWS**: EC2 or Lambda deployment
- **Google Cloud**: App Engine or Cloud Run

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## 🔮 Roadmap

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