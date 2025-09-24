import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI, type User } from './api/auth'
import { ToastProvider } from './components/ui'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import UserProfile from './pages/UserProfile'
import './App.css'

function App() {
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authAPI.getCurrentUser();
    const token = authAPI.getToken();
    
    if (currentUser && token) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: User) => {
    authAPI.setAuth(token, userData);
    setUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout()
    setUser(null)
  }

  const handleSignup = (token: string, userData: User) => {
    authAPI.setAuth(token, userData);
    setUser(userData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Home onLogout={handleLogout} />
              </motion.div>
            } 
          />
          <Route 
            path="/login" 
            element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
              </motion.div>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {user ? <Navigate to="/" replace /> : <Signup onSignup={handleSignup} />}
              </motion.div>
            } 
          />
          <Route 
            path="/recipe/:id" 
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <RecipeDetail user={user} />
              </motion.div>
            } 
          />
          <Route 
            path="/create-recipe" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {user ? <CreateRecipe /> : <Navigate to="/login" replace />}
              </motion.div>
            } 
          />
          <Route 
            path="/edit-recipe/:id" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {user ? <EditRecipe /> : <Navigate to="/login" replace />}
              </motion.div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {user ? <UserProfile /> : <Navigate to="/login" replace />}
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </ToastProvider>
  )
}

export default App;
