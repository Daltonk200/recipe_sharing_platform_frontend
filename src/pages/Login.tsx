import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, ArrowRight } from 'lucide-react'
import { authAPI, type User } from '../api/auth'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, useToast } from '../components/ui'

interface LoginProps {
  onLogin: (token: string, user: User) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const toast = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(formData)
      toast.success('Welcome back!', `Hello ${response.user.username}!`)
      onLogin(response.token, response.user)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      toast.error('Login failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-neutral-600">Sign in to your RecipeShare account</p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
