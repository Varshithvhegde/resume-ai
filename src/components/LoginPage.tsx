import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle, FileText, Zap, Mail, Database, Target } from "lucide-react"

const HomePage = () => {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI Resume Analysis",
      description: "Connect your Google Doc resume and let AI analyze and optimize it automatically"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Persistent Profile",
      description: "Save your resume data once - experience, education, skills, and projects stored securely"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Job-Tailored Resumes",
      description: "Paste any job description and get a customized resume optimized for that role"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Automation",
      description: "Draft and send professional application emails with your resume directly through Gmail"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Google Docs Integration",
      description: "Generate ATS-optimized resumes directly in your Google Drive with professional formatting"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-Time AI Chat",
      description: "Chat with AI to refine your resume, get suggestions, and make improvements instantly"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Connect Your Google Doc",
      description: "Upload your resume to Google Drive and share the link with Resumify"
    },
    {
      step: "2",
      title: "AI Reads & Creates Profile",
      description: "Our AI agent analyzes your document and automatically creates a comprehensive profile"
    },
    {
      step: "3",
      title: "Paste Job Description",
      description: "Add any job posting you're interested in to tailor your resume specifically for that role"
    },
    {
      step: "4",
      title: "Get Optimized Resume",
      description: "Receive an ATS-optimized resume in Google Docs, perfectly matched to the job requirements"
    },
    {
      step: "5",
      title: "Draft & Send Emails",
      description: "Create professional application emails and send them directly through your Gmail"
    }
  ]

  const benefits = [
    "One-time profile setup with persistent data storage",
    "AI-powered job description matching",
    "ATS-optimized Google Docs generation",
    "Gmail integration for seamless applications",
    "Custom tailoring for each job opportunity",
    "Professional email templates and drafting",
    "Secure profile management and updates",
    "Real-time collaboration in Google Docs"
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div 
          className='absolute inset-0 opacity-[0.02] dark:opacity-[0.03]'
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        <div className='absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '2s' }} />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className='relative z-10 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-2'>
              <div className='w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Resumify
              </span>
            </div>

            <nav className='hidden md:flex items-center gap-8'>
              <a href='#features' className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                Features
              </a>
              <a href='#how-it-works' className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                How It Works
              </a>
              <a href='#benefits' className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                Benefits
              </a>
            </nav>

            <Button 
              asChild
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
            >
              <a href='/auth/login'>
                Get Started Free
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative z-10 pt-24 pb-32 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full mb-8'>
              <Sparkles className='w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse' />
              <span className='text-sm font-semibold text-blue-700 dark:text-blue-300'>
                AI-Powered Career Acceleration
              </span>
            </div>

            <h1 className='text-6xl sm:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight'>
              Tailor Your Resume
              <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                For Every Job
              </span>
            </h1>

            <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto'>
              Connect your Google Doc, paste any job description, and get an ATS-optimized resume with automated email drafting—all powered by AI.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'>
              <Button 
                asChild
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl px-8 text-lg h-14'
              >
                <a href='/auth/login' className='flex items-center gap-2'>
                  Start Building Free
                  <ArrowRight className='w-5 h-5' />
                </a>
              </Button>
              <Button 
                asChild
                size='lg'
                variant='outline'
                className='border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 h-14 px-8 text-lg'
              >
                <a href='#how-it-works'>
                  Watch Demo
                </a>
              </Button>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
                <span className='font-medium'>No credit card required</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
                <span className='font-medium'>Google Docs integration</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
                <span className='font-medium'>Gmail automation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id='features' className='relative z-10 py-24 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              Everything You Need to Land Your Dream Job
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
              From profile creation to email sending—automated, intelligent, and effortless
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                className='bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 group'
              >
                <CardContent className='p-8'>
                  <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id='how-it-works' className='relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/30'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              How Resumify Works
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Five simple steps from resume to inbox
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {howItWorks.map((item, idx) => (
              <Card key={idx} className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow relative overflow-hidden group'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform' />
                <CardContent className='p-8 relative'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-5 text-white text-xl font-bold shadow-lg'>
                    {item.step}
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                    {item.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id='benefits' className='relative z-10 py-24 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <div>
              <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
                Why Choose Resumify?
              </h2>
              <p className='text-xl text-gray-600 dark:text-gray-400 mb-10'>
                Built for modern job seekers who need speed, precision, and automation
              </p>

              <div className='space-y-4'>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className='flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors'>
                    <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-lg text-gray-700 dark:text-gray-300 font-medium'>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-3xl opacity-20' />
              <Card className='bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-2xl relative'>
                <CardContent className='p-10'>
                  <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4'>
                      <Zap className='w-8 h-8 text-white' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                      Ready in Minutes
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                      From sign-up to first tailored resume
                    </p>
                  </div>
                  
                  <div className='space-y-6'>
                    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <span className='font-semibold text-gray-900 dark:text-white'>Setup Time</span>
                      <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>2 min</span>
                    </div>
                    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <span className='font-semibold text-gray-900 dark:text-white'>Resume Generation</span>
                      <span className='text-2xl font-bold text-purple-600 dark:text-purple-400'>30 sec</span>
                    </div>
                    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <span className='font-semibold text-gray-900 dark:text-white'>Email Drafting</span>
                      <span className='text-2xl font-bold text-green-600 dark:text-green-400'>15 sec</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl sm:text-5xl font-bold text-white mb-6'>
            Ready to Transform Your Job Search?
          </h2>
          <p className='text-xl text-blue-100 mb-10 max-w-2xl mx-auto'>
            Join thousands of professionals who are landing interviews faster with AI-powered, job-tailored resumes
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button 
              asChild
              size='lg'
              className='bg-white hover:bg-gray-100 text-blue-600 px-10 text-lg h-14 shadow-2xl'
            >
              <a href='/auth/login' className='flex items-center gap-2'>
                Start Free Now
                <ArrowRight className='w-5 h-5' />
              </a>
            </Button>
            <Button 
              asChild
              size='lg'
              variant='outline'
              className='border-2 border-white text-white hover:bg-white/10 h-14 px-10 text-lg'
            >
              <a href='#features'>
                Learn More
              </a>
            </Button>
          </div>
          <p className='mt-6 text-blue-100 text-sm'>
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 border-t border-gray-200 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div className='flex items-center gap-2'>
              <div className='w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Resumify
              </span>
            </div>
            
            <div className='flex gap-8 text-sm text-gray-600 dark:text-gray-400'>
              <a href='#' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'>
                Privacy Policy
              </a>
              <a href='#' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'>
                Terms of Service
              </a>
              <a href='#' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'>
                Contact Us
              </a>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400'>
              © 2024 Resumify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage