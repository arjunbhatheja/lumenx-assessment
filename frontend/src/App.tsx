import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <h1>EnergeX Posts</h1>
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span>Welcome, {user?.name}!</span>
                <Link to="/posts" style={{ color: 'white', textDecoration: 'none' }}>Posts</Link>
                <Link to="/create-post" style={{ color: 'white', textDecoration: 'none' }}>Create Post</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
              </div>
            )}
          </nav>
        </header>
        
        <main style={{ padding: '2rem', minHeight: '80vh' }}>
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/posts" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register onLogin={handleLogin} /> : <Navigate to="/posts" />} 
            />
            <Route 
              path="/posts" 
              element={isAuthenticated ? <PostList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-post" 
              element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/posts" : "/login"} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
