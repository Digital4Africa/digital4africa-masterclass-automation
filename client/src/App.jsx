import { useState, useEffect } from 'react'

function App() {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const funnyTexts = [
    "Teaching robots to be human... 🤖",
    "Brewing the perfect algorithm... ☕",
    "Training AI to procrastinate... ⏰",
    "Loading infinite wisdom... ∞",
    "Debugging the matrix... 🔧",
    "Compiling greatness... 💎"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % funnyTexts.length)
        setIsVisible(true)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute -bottom-32 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        ></div>
      ))}

      <div className="text-center z-10 px-8">
        {/* Main logo/title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse mb-4 leading-tight">
            MASTERCLASS
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/80 tracking-widest">
            AUTOMATION
          </div>
        </div>

        {/* Animated coming soon badge */}
        <div className="relative mb-8 sm:mb-12">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-violet-500 p-1 rounded-full animate-spin-slow">
            <div className="bg-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full">
              <span className="text-white text-sm sm:text-lg md:text-xl font-semibold tracking-wide">
                COMING SOON
              </span>
            </div>
          </div>
        </div>

        {/* Funny rotating text */}
        <div className="h-12 sm:h-16 flex items-center justify-center mb-8 sm:mb-12 px-4">
          <p
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 font-medium transition-all duration-300 text-center ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            {funnyTexts[currentText]}
          </p>
        </div>

        {/* Creative status indicators */}
        <div className="max-w-sm mx-auto mb-8 sm:mb-12">
          <div className="space-y-3 sm:space-y-4">
            {/* Fixing bugs */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-white/80 text-sm sm:text-base">Squashing bugs</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-200"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-400"></div>
              </div>
            </div>

            {/* Polishing UI */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-white/80 text-sm sm:text-base">Polishing magic</span>
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Adding features */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-white/80 text-sm sm:text-base">Adding awesomeness</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-4 bg-purple-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inspirational message */}
        <div className="space-y-4 px-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-4 sm:py-6 border border-white/10">
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
              "The future belongs to those who automate today's tedious tasks."
            </p>
            <p className="text-white/50 text-xs sm:text-sm mt-2">- The Masterclass Team</p>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-8 sm:mt-12 md:mt-16 flex justify-center space-x-4 sm:space-x-6 md:space-x-8 text-white/40 px-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">1,337</div>
            <div className="text-xs sm:text-sm">Excited Humans</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">42</div>
            <div className="text-xs sm:text-sm">Coffee Cups</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">∞</div>
            <div className="text-xs sm:text-sm">Possibilities</div>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 text-white/20">
        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-white/20"></div>
      </div>
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 text-white/20">
        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-white/20"></div>
      </div>
    </div>
  )
}

export default App