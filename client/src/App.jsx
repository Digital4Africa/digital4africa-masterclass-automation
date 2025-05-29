import { useState, useEffect } from 'react'

function App() {
  const [timeLeft, setTimeLeft] = useState({})
  const [mounted, setMounted] = useState(false)
  const [currentText, setCurrentText] = useState(0)

  const rotatingTexts = [
    "Automating Africa's Future...",
    "Building Tomorrow's Solutions...",
    "Empowering Digital Transformation...",
    "Masterclass in Automation..."
  ]

  // Calculate time until June 5th, 2025
  const targetDate = new Date('2025-06-05T00:00:00').getTime()

  useEffect(() => {
    setMounted(true)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    // Text rotation
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % rotatingTexts.length)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [targetDate])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/10 via-purple-950/10 to-pink-950/10"></div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-drift 25s linear infinite'
          }}
        ></div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-20 animate-pulse"
          style={{
            left: `${5 + (i * 6)}%`,
            top: `${10 + (i * 5)}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        ></div>
      ))}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

        {/* Logo */}
        <div className="mb-8">
          <img
            src="https://res.cloudinary.com/diizjejos/image/upload/v1746761694/logo_b6qvn2.png"
            alt="Digital4Africa Logo"
            className="h-16 sm:h-20 md:h-24 w-auto animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
          />
        </div>

        {/* Company name */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white/90 tracking-widest mb-2">
            DIGITAL4AFRICA
          </h1>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
        </div>

        {/* Main title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
              MASTERCLASS
            </span>
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white/80 tracking-wider">
            AUTOMATION
          </h3>
        </div>

        {/* Countdown */}
        <div className="mb-12 w-full max-w-4xl">
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'DAYS', value: timeLeft.days, color: 'text-cyan-400' },
              { label: 'HOURS', value: timeLeft.hours, color: 'text-purple-400' },
              { label: 'MINS', value: timeLeft.minutes, color: 'text-pink-400' },
              { label: 'SECS', value: timeLeft.seconds, color: 'text-orange-400' }
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6
                                hover:border-white/30 hover:bg-white/10 transition-all duration-300
                                hover:transform hover:scale-105 hover:shadow-2xl">
                  <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-2 ${item.color}`}>
                    {String(item.value || 0).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60 tracking-wider font-medium">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rotating text */}
        <div className="mb-12 h-8 flex items-center justify-center">
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-light text-center
                        transition-all duration-500 animate-pulse">
            {rotatingTexts[currentText]}
          </p>
        </div>

        {/* Coming soon badge */}
        <div className="mb-12">
          <div className="relative">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-1 rounded-full animate-spin-slow">
              <div className="bg-slate-900 px-8 py-3 rounded-full">
                <span className="text-white text-lg font-semibold tracking-wide">
                  FIRST PHASE LAUNCHING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Simple call to action */}
        <div className="text-center max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-xl p-6">
            <p className="text-white/80 text-base leading-relaxed mb-3">
              The future of automation starts here.
            </p>
            <p className="text-cyan-400 text-sm font-medium">
              June 5th, 2025 • 00:00 GMT
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes grid-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default App