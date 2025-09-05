import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  PostAdd,
  ViewList,
  People,
  ExitToApp,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { lightTheme, darkTheme } from './themes';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  const currentTheme = darkMode ? darkTheme : lightTheme;

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
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" elevation={1}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                EnergeX Posts
              </Typography>
              
              {/* Dark Mode Toggle */}
              <IconButton
                color="inherit"
                onClick={() => setDarkMode(!darkMode)}
                sx={{ mr: 2, width: 40, height: 40 }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/posts"
                    startIcon={<ViewList />}
                    sx={{ minWidth: 'auto', height: 40 }}
                  >
                    Posts
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/create-post"
                    startIcon={<PostAdd />}
                    sx={{ minWidth: 'auto', height: 40 }}
                  >
                    Create
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        color="inherit"
                        component={Link}
                        to="/admin"
                        startIcon={<Dashboard />}
                        sx={{ minWidth: 'auto', height: 40 }}
                      >
                        Dashboard
                      </Button>
                      <Button
                        color="inherit"
                        component={Link}
                        to="/admin/users"
                        startIcon={<People />}
                        sx={{ minWidth: 'auto', height: 40 }}
                      >
                        Users
                      </Button>
                    </>
                  )}
                  
                  <Button
                    color="inherit"
                    onClick={handleMenuClick}
                    startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>}
                    sx={{ minWidth: 'auto', height: 40 }}
                  >
                    {user?.name}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <AccountCircle sx={{ mr: 2 }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 2 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    sx={{ minWidth: 'auto', height: 40 }}
                  >
                    Login
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    sx={{ minWidth: 'auto', height: 40 }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                element={isAuthenticated ? <PostList currentUser={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/create-post" 
                element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/edit-post/:id" 
                element={isAuthenticated ? <EditPost /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/admin" 
                element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/posts" />} 
              />
              <Route 
                path="/admin/users" 
                element={isAuthenticated && isAdmin ? <UserManagement /> : <Navigate to="/posts" />} 
              />
              <Route 
                path="/" 
                element={<Navigate to={isAuthenticated ? "/posts" : "/login"} />} 
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
