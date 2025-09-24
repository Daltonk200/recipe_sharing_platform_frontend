import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, ArrowRight } from 'lucide-react'
import { authAPI, type User as UserType } from '../api/auth'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, useToast } from '../components/ui'

interface SignupProps {
  onSignup: (token: string, user: UserType) => void
}

const Signup = ({ onSignup }: SignupProps) => {
  const toast = useToast()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      toast.error('Password mismatch', 'Please make sure your passwords match')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      toast.success('Account created!', `Welcome ${response.user.username}!`)
      onSignup(response.token, response.user)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Signup failed'
      setError(errorMessage)
      toast.error('Signup failed', errorMessage)
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
            <CardTitle className="text-2xl">Join RecipeShare</CardTitle>
            <p className="text-neutral-600">Create your account to start sharing recipes</p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Username"
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />

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
                placeholder="Create a password"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Signup
