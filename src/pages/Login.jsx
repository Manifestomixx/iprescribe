import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { login } from '../services/auth'
import useAuthStore from '../store/authStore'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login: setAuth, initialize } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)
      
      const token = response.token || response.data?.token
      const user = response.user || response.data?.user || { email }
      
      if (token) {
        setAuth(user, token)
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        setError('Login successful but no token received')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#283C85] to-[#090E1F] relative p-10 md:p-0">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 0.5px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 0.5px)
          `,
          backgroundSize: '10px 10px',
        }}
      />

      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative z-10 p-10">
        <div className="flex justify-center mb-8">
          <img 
            src={Icon.logo} 
            alt="iPrescribe Logo" 
          />
        </div>

        <h1 className="text-[20px] font-bold text-[#1a1a1a] text-center mb-2">
          Login to iPrescribe Admin
        </h1>

        <p className="text-[#666] text-center mb-8 text-sm">
          Provide the required details to login
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#1a1a1a] font-medium mb-2 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. admin@careoneclinics.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] bg-white text-sm focus:outline-none focus:border-[#1e3a5f] hover:border-[#b0b0b0] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#1a1a1a] font-medium mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='password'
                className="w-full px-4 py-3 pr-12 rounded-lg border border-[#e0e0e0] bg-white text-sm focus:outline-none focus:border-[#1e3a5f] hover:border-[#b0b0b0] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#1e3a5f] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                    />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end mb-8">
            <a
              href="#"
              className="text-[#666] text-sm no-underline hover:underline hover:text-[#1e3a5f] transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#283C85] text-white py-3.5 rounded-xl text-base font-semibold hover:bg-[#2d4a6f] hover:shadow-[0_4px_12px_rgba(30,58,95,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

