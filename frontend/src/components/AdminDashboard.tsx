import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  PersonOutline as UserIcon,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

interface UserStats {
  total_users: number;
  admin_users: number;
  regular_users: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h3" component="h2" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Welcome to the administration panel. Here you can view user statistics and manage the platform.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Total Users"
            value={stats?.total_users || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Admin Users"
            value={stats?.admin_users || 0}
            icon={<AdminIcon />}
            color="#ed6c02"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Regular Users"
            value={stats?.regular_users || 0}
            icon={<UserIcon />}
            color="#2e7d32"
          />
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Use the navigation above to:
        </Typography>
        <Box component="ul" sx={{ mt: 2, pl: 3 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            View and manage all posts (edit/delete any post)
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            View all registered users
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Create new posts
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
