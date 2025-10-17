import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle, FileText, Zap, Users } from "lucide-react"

const HomePage = () => {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI-Powered Analysis",
      description: "Get instant feedback on your resume with advanced AI technology"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Smart Formatting",
      description: "Automatically improve layout and structure for better readability"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Improvements",
      description: "Receive real-time suggestions as you chat with our AI assistant"
    }
  ]

  const benefits = [
    "Tailored suggestions for your target role",
    "ATS-optimized content and keywords",
    "Professional formatting recommendations",
    "Skills and achievements enhancement"
  ]

  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 relative overflow-hidden'>
      {/* Animated Grid Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div 
          className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Gradient Overlays */}
        <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className='relative z-10 border-b border-gray-200 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center'>
                <FileText className='w-5 h-5 text-white dark:text-gray-900' />
              </div>
              <span className='text-xl font-semibold text-gray-900 dark:text-white'>
                ResumeAI
              </span>
            </div>

            {/* Nav Links */}
            <nav className='hidden md:flex items-center gap-8'>
              <a href='#features' className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>
                Features
              </a>
              <a href='#how-it-works' className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>
                How It Works
              </a>
              <a href='#pricing' className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'>
                Pricing
              </a>
            </nav>

            {/* CTA Button */}
            <Button 
              asChild
              className='bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900'
            >
              <a href='/auth/login'>
                Get Started
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative z-10 pt-20 pb-24 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center max-w-3xl mx-auto'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full mb-6'>
              <Sparkles className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                AI-Powered Resume Assistant
              </span>
            </div>

            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
              Build Your Perfect Resume with AI
            </h1>

            <p className='text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed'>
              Get instant feedback, smart suggestions, and professional formatting. 
              Stand out from the crowd with a resume that gets noticed.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button 
                asChild
                size='lg'
                className='bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-8'
              >
                <a href='/auth/login' className='flex items-center gap-2'>
                  Start Building
                  <ArrowRight className='w-4 h-4' />
                </a>
              </Button>
              <Button 
                asChild
                size='lg'
                variant='outline'
                className='border-gray-300 dark:border-gray-700'
              >
                <a href='#how-it-works'>
                  See How It Works
                </a>
              </Button>
            </div>

            {/* Social Proof */}
            <div className='mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400'>
              <div className='flex items-center gap-2'>
                <Users className='w-4 h-4' />
                <span>10,000+ users</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>95% success rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Powerful Features
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Everything you need to create a standout resume that gets results
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {features.map((feature, idx) => (
              <Card key={idx} className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow'>
                <CardContent className='p-6'>
                  <div className='w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-gray-900 dark:text-white'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='how-it-works' className='relative z-10 py-24 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                How It Works
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
                Our AI assistant makes resume building simple and effective
              </p>

              <div className='space-y-6'>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className='flex items-start gap-3'>
                    <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-700 dark:text-gray-300'>{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild
                size='lg'
                className='mt-8 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900'
              >
                <a href='/auth/login' className='flex items-center gap-2'>
                  Try It Free
                  <ArrowRight className='w-4 h-4' />
                </a>
              </Button>
            </div>

            <div className='relative'>
              <Card className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl'>
                <CardContent className='p-8'>
                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white'>
                        1
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>Upload Your Resume</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Start by uploading your current resume or create a new one</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white'>
                        2
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>Chat with AI</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Ask questions and get instant feedback on improvements</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white'>
                        3
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>Get Your Perfect Resume</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Download your polished, ATS-optimized resume</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Ready to Build Your Perfect Resume?
          </h2>
          <p className='text-xl text-gray-300 mb-10'>
            Join thousands of job seekers who have improved their resumes with AI
          </p>
          <Button 
            asChild
            size='lg'
            className='bg-white hover:bg-gray-100 text-gray-900 px-8'
          >
            <a href='/auth/login' className='flex items-center gap-2'>
              Get Started Free
              <ArrowRight className='w-4 h-4' />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 border-t border-gray-200 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center'>
                <FileText className='w-5 h-5 text-white dark:text-gray-900' />
              </div>
              <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                ResumeAI
              </span>
            </div>
            
            <div className='flex gap-6 text-sm text-gray-600 dark:text-gray-400'>
              <a href='#' className='hover:text-gray-900 dark:hover:text-white transition-colors'>
                Privacy Policy
              </a>
              <a href='#' className='hover:text-gray-900 dark:hover:text-white transition-colors'>
                Terms of Service
              </a>
              <a href='#' className='hover:text-gray-900 dark:hover:text-white transition-colors'>
                Contact
              </a>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400'>
              © 2024 ResumeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage