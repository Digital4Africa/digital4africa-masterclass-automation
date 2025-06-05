import { useState, useEffect } from 'react'

function Landing() {
  const [timeLeft, setTimeLeft] = useState({})
  const [mounted, setMounted] = useState(false)
  const [currentText, setCurrentText] = useState(0)
  const [isLaunched, setIsLaunched] = useState(false)
  const [currentLaunchText, setCurrentLaunchText] = useState(0)

  const rotatingTexts = [
    "Automating Africa's Future...",
    "Building Tomorrow's Solutions...",
    "Empowering Digital Transformation...",
    "Masterclass in Automation..."
  ]

  const launchTexts = [
    "🚀 Initializing Launch Sequence...",
    "⚡ Powering Up Systems...",
    "🌟 Calibrating Excellence...",
    "🔥 Activating Masterclass Mode...",
    "✨ Finalizing Digital Magic...",
    "🎯 Loading Premium Content...",
    "🚀 Deploying Innovation...",
    "⭐ Synchronizing Brilliance...",
    "🔮 Processing Automation Mastery...",
    "🎨 Crafting Your Experience..."
  ]

  // Calculate time until June 5th, 2025
  const targetDate = new Date('2025-06-05T00:00:00').getTime()

  useEffect(() => {
    setMounted(true)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance <= 0) {
        setIsLaunched(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    // Text rotation for pre-launch
    const textInterval = setInterval(() => {
      if (!isLaunched) {
        setCurrentText(prev => (prev + 1) % rotatingTexts.length)
      }
    }, 3000)

    // Launch text rotation - faster for more dynamic feel
    const launchTextInterval = setInterval(() => {
      if (isLaunched) {
        setCurrentLaunchText(prev => (prev + 1) % launchTexts.length)
      }
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
      clearInterval(launchTextInterval)
    }
  }, [targetDate, isLaunched])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isLaunched ? 'bg-gradient-to-br from-green-950/20 via-blue-950/20 to-purple-950/20' : 'bg-gradient-to-br from-cyan-950/10 via-purple-950/10 to-pink-950/10'}`}></div>
        <div
          className={`absolute inset-0 opacity-5 ${isLaunched ? 'animate-pulse' : ''}`}
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: isLaunched ? 'grid-drift-fast 10s linear infinite' : 'grid-drift 25s linear infinite'
          }}
        ></div>
      </div>

      {/* Floating particles */}
      {[...Array(isLaunched ? 25 : 15)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${isLaunched ? 'bg-green-400' : 'bg-cyan-400'} rounded-full opacity-20 animate-pulse`}
          style={{
            left: `${5 + (i * 6)}%`,
            top: `${10 + (i * 5)}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${isLaunched ? 1 + Math.random() : 3 + Math.random() * 2}s`
          }}
        ></div>
      ))}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

        {/* Logo */}
        <div className="mb-8">
          <img
            src="https://res.cloudinary.com/diizjejos/image/upload/v1746761694/logo_b6qvn2.png"
            alt="Digital4Africa Logo"
            className={`h-16 sm:h-20 md:h-24 w-auto transition-all duration-300 hover:scale-110 ${isLaunched ? 'animate-bounce' : 'animate-pulse hover:animate-none'}`}
          />
        </div>

        {/* Company name */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white/90 tracking-widest mb-2">
            DIGITAL4AFRICA
          </h1>
          <div className={`h-0.5 w-24 mx-auto bg-gradient-to-r ${isLaunched ? 'from-green-400 to-blue-400' : 'from-cyan-400 to-purple-400'} rounded-full`}></div>
        </div>

        {/* Main title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4">
            <span className={`bg-gradient-to-r ${isLaunched ? 'from-green-400 via-blue-500 to-purple-500' : 'from-cyan-400 via-purple-500 to-pink-500'} bg-clip-text text-transparent animate-gradient-x`}>
              MASTERCLASS
            </span>
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white/80 tracking-wider">
            AUTOMATION
          </h3>
        </div>

        {/* Launch Status */}
        <div className="mb-12">
          <div className="relative">
            <div className={`bg-gradient-to-r ${isLaunched ? 'from-green-500 to-blue-500 animate-pulse-glow-green' : 'from-cyan-500 to-purple-500 animate-pulse-glow'} p-1 rounded-full`}>
              <div className="bg-slate-900 px-8 py-3 rounded-full">
                <span className="text-white text-lg font-semibold tracking-wide">
                  {isLaunched ? "🎉 MASTERCLASS ACTIVATED!" : "FIRST PHASE LAUNCHING"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown or Launch Animation */}
        {!isLaunched ? (
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
        ) : (
          <div className="mb-12 w-full max-w-4xl">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-green-400/30 rounded-3xl p-8 md:p-12
                              hover:border-green-400/50 hover:bg-gradient-to-r hover:from-green-500/30 hover:via-blue-500/30 hover:to-purple-500/30
                              transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl animate-pulse">

                {/* Loading Animation */}
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full animate-progress-bar"></div>
                  </div>
                </div>

                {/* Creative Status Text */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text mb-4">
                  {launchTexts[currentLaunchText]}
                </div>

                <div className="text-lg text-white/70">
                  Please wait while we prepare your masterclass experience...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rotating text */}
        <div className="mb-12 h-8 flex items-center justify-center">
          <p className={`text-lg sm:text-xl md:text-2xl font-light text-center transition-all duration-500 ${isLaunched ? 'text-green-300/80 animate-pulse' : 'text-white/70 animate-pulse'}`}>
            {isLaunched ? "🎓 Welcome to the Future of Automation" : rotatingTexts[currentText]}
          </p>
        </div>

        {/* Call to action */}
        <div className="text-center max-w-md">
          <div className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 ${isLaunched ? 'border-green-400/20' : 'border-cyan-400/20'}`}>
            <p className="text-white/80 text-base leading-relaxed mb-3">
              {isLaunched ? "🚀 Your automation journey begins now!" : "The future of automation starts here."}
            </p>
            <p className={`text-sm font-medium ${isLaunched ? 'text-green-400' : 'text-cyan-400'}`}>
              {isLaunched ? "Experience is Loading • Please Stay Tuned" : "June 5th, 2025 • 00:00 GMT"}
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

        @keyframes grid-drift-fast {
          0% { transform: translate(0, 0); }
          100% { transform: translate(120px, 120px); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(168, 85, 247, 0.2);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(168, 85, 247, 0.4);
          }
        }

        @keyframes pulse-glow-green {
          0%, 100% {
            opacity: 0.6;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(59, 130, 246, 0.2);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }

        @keyframes progress-bar {
          0% { width: 0%; }
          50% { width: 75%; }
          100% { width: 100%; }
        }

        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-pulse-glow-green {
          animation: pulse-glow-green 2s ease-in-out infinite;
        }

        .animate-progress-bar {
          animation: progress-bar 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Landing