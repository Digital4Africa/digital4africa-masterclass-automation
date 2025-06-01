import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle login logic here
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="input-field w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0060a1] focus:ring-1 focus:ring-[#0060a1] outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="input-field w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0060a1] focus:ring-1 focus:ring-[#0060a1] outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          className="h-4 w-4 text-[#0060a1] focus:ring-[#0060a1] border-gray-300 rounded"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
          Remember me
        </label>
      </div> */}

      <button
        type="submit"
        className="btn-primary w-full py-3 px-4 rounded-lg bg-[#0060a1] text-white font-semibold hover:bg-[#005589] transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>

      {/* <div className="text-center pt-2">
        <a href="#forgot-password" className="text-sm text-[#0060a1] hover:text-[#d20a11] transition-colors">
          Forgot password?
        </a>
      </div> */}
    </form>
  );
};

export default LoginForm;