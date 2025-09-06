import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { websocketService } from '../services/websocket';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const EditPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID is required');
        setFetchLoading(false);
        return;
      }

      try {
        const response = await postsAPI.getPost(id);
        const postData = response.data;
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch post');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const response = await postsAPI.updatePost(id, { title, content });
      // Backend will publish to Redis/WebSocket automatically
      // No need to emit WebSocket event manually
      
      navigate('/posts'); // Redirect to posts list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !post) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/posts')}>
          Back to Posts
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Edit Post
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Update your post content
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
                {loading ? <CircularProgress size={24} /> : 'Update Post'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditPost;
