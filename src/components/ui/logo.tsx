export default function Logo({ mode = "light" }: { mode?: "light" | "dark" }) {
  return (
    <div className='flex items-center gap-2'>
      <div
        className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border ${
          mode === "light" ? "border-white/30" : "border-black/30"
        }`}
      >
        <svg
          className='w-6 h-6 '
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <polyline
            points='14,2 14,8 20,8'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <circle cx='12' cy='13' r='2' stroke='currentColor' strokeWidth='2' />
          <path
            d='M12 11v4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            d='M10 13h4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      </div>
      <div className=''>
        <h2 className='text-xl font-bold tracking-tight text-white'>Resumify</h2>
        <p className='text-xs font-medium text-white'>AI-Powered</p>
      </div>
    </div>
  )
}
