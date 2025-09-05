import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  FormHelperText,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

interface RegisterProps {
  onLogin: (token: string, user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password requirements check
  const getPasswordRequirements = (password: string) => [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password) },
  ];

  const passwordRequirements = getPasswordRequirements(formData.password);
  const passwordScore = passwordRequirements.filter(req => req.met).length;
  const passwordStrength = passwordScore === 0 ? 0 : (passwordScore / passwordRequirements.length) * 100;

  const getStrengthColor = () => {
    if (passwordScore < 2) return 'error';
    if (passwordScore < 4) return 'warning';
    return 'success';
  };

  const getStrengthLabel = () => {
    if (passwordScore < 2) return 'Weak';
    if (passwordScore < 4) return 'Medium';
    return 'Strong';
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordScore < 3) {
      setError('Password is too weak. Please meet at least 3 requirements.');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.data.token && response.data.user) {
        onLogin(response.data.token, response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          mx: 2,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark' ? 4 : 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              color="primary"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join EnergeX Posts today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange('name')}
              sx={{ mb: 2 }}
              required
              disabled={loading}
              autoFocus
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange('email')}
              sx={{ mb: 2 }}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange('password')}
              sx={{ mb: 1 }}
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ mr: 1 }}>
                    Password Strength:
                  </Typography>
                  <Chip
                    label={getStrengthLabel()}
                    color={getStrengthColor()}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={getStrengthColor()}
                  sx={{ height: 6, borderRadius: 3, mb: 1 }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {passwordRequirements.map((req, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {req.met ? (
                        <CheckCircle color="success" sx={{ fontSize: 14 }} />
                      ) : (
                        <Cancel color="error" sx={{ fontSize: 14 }} />
                      )}
                      <Typography
                        variant="caption"
                        color={req.met ? 'success.main' : 'text.secondary'}
                      >
                        {req.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              sx={{ mb: 3 }}
              required
              disabled={loading}
              error={!!(formData.confirmPassword && formData.password !== formData.confirmPassword)}
              helperText={
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, mb: 3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" underline="hover">
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
