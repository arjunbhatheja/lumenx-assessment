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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { websocketService } from '../services/websocket';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await postsAPI.createPost({ title, content });
      // Backend will publish to Redis/WebSocket automatically
      // No need to emit WebSocket event manually
      
      navigate('/posts'); // Redirect to posts list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Create New Post
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Share your thoughts with the community
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
              autoFocus
              helperText="Choose a descriptive title for your post"
            />
            <TextField
              fullWidth
              label="Post Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              margin="normal"
              multiline
              rows={8}
              helperText="Write your post content here"
            />
            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/posts')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !title.trim() || !content.trim()}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Post'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePost;
