import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home onLogout={handleLogout} />} />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            user ? <Navigate to="/" replace /> : <Signup onLogin={handleLogin} />
          } 
        />
        <Route path="/recipe/:id" element={<RecipeDetail user={user} />} />
        <Route 
          path="/create-recipe" 
          element={
            user ? <CreateRecipe /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/edit-recipe/:id" 
          element={
            user ? <EditRecipe /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/profile" 
          element={
            user ? <UserProfile /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </ToastProvider>
  )
}

export default App;
