import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Snackbar,
  Avatar,
  InputAdornment,
  Fade,
  Skeleton,
  Paper,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WifiOutlined as ConnectionIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { postsAPI } from '../services/api';
import { websocketService } from '../services/websocket';

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

interface PostListProps {
  currentUser: any;
}

const PostList: React.FC<PostListProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; postId: number | null }>({
    open: false,
    postId: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [connected, setConnected] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchPosts();
    
    if (currentUser && websocketService) {
      websocketService.connect();
      setConnected(true);

      const handleNewPost = (newPost: any) => {
        console.log('New post received:', newPost);
        setPosts(prevPosts => [newPost, ...prevPosts]); // Add to top of list
        setSnackbar({ open: true, message: 'New post added!', severity: 'success' });
      };

      const handlePostUpdate = (updatedPost: any) => {
        console.log('Post updated:', updatedPost);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === updatedPost.id ? updatedPost : post
          )
        );
        setSnackbar({ open: true, message: 'Post updated!', severity: 'success' });
      };

      const handlePostDelete = (data: any) => {
        console.log('Post deleted:', data);
        setPosts(prevPosts => 
          prevPosts.filter(post => post.id !== data.id)
        );
        setSnackbar({ open: true, message: 'Post deleted!', severity: 'success' });
      };

      // Register WebSocket event listeners
      websocketService.onPostCreated(handleNewPost);
      websocketService.onPostUpdated(handlePostUpdate);
      websocketService.onPostDeleted(handlePostDelete);
      
      return () => {
        // Clean up event listeners
        websocketService.offPostCreated();
        websocketService.offPostUpdated();
        websocketService.offPostDeleted();
        websocketService.disconnect();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [posts, searchTerm, showMyPosts, sortOrder]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.data || response.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // My posts filter
    if (showMyPosts && currentUser) {
      filtered = filtered.filter((post) => post.user.id === currentUser.id);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredPosts(filtered);
  };

  const handleDelete = async (postId: number) => {
    try {
      await postsAPI.deletePost(postId.toString());
      // Backend will publish to Redis/WebSocket automatically
      // No need to emit WebSocket event manually
      
      setPosts(posts.filter((post) => post.id !== postId));
      setSnackbar({ open: true, message: 'Post deleted successfully', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Failed to delete post', severity: 'error' });
    } finally {
      setDeleteDialog({ open: false, postId: null });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <Fade in timeout={300}>
      <Card
        sx={{
          mb: 2,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {post.user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {post.user.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={post.user.role}
                    size="small"
                    color={post.user.role === 'admin' ? 'secondary' : 'default'}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="textSecondary">
                    <ScheduleIcon sx={{ fontSize: 12, mr: 0.5 }} />
                    {formatDate(post.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {currentUser && (currentUser.role === 'admin' || currentUser.id === post.user.id) && (
              <Box display="flex" gap={0.5}>
                <Tooltip title="Edit Post">
                  <IconButton 
                    size="small"
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.50' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Post">
                  <IconButton 
                    size="small"
                    onClick={() => setDeleteDialog({ open: true, postId: post.id })}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { backgroundColor: 'error.50' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
            {post.title}
          </Typography>
          
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {post.content}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );

  const PostSkeleton: React.FC = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>
        </Box>
        <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Posts
        </Typography>
        {[1, 2, 3].map((n) => (
          <PostSkeleton key={n} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header with connection status */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Posts
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title={connected ? 'Real-time updates active' : 'Not connected'}>
            <Chip
              icon={<ConnectionIcon />}
              label={connected ? 'Connected' : 'Offline'}
              color={connected ? 'success' : 'default'}
              variant="outlined"
              size="small"
            />
          </Tooltip>
          <Badge badgeContent={filteredPosts.length} color="primary">
            <Chip label="Posts" variant="outlined" />
          </Badge>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <TextField
            placeholder="Search posts, content, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={fetchPosts} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={showMyPosts}
                onChange={(e) => setShowMyPosts(e.target.checked)}
                color="primary"
              />
            }
            label="My Posts Only"
          />

          <FormControlLabel
            control={
              <Switch
                checked={sortOrder !== 'newest'}
                onChange={(e) => setSortOrder(e.target.checked ? 'oldest' : 'newest')}
                color="primary"
              />
            }
            label="Oldest First"
          />

          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'grid'}
                onChange={(e) => setViewMode(e.target.checked ? 'grid' : 'list')}
                color="primary"
              />
            }
            label="Grid View"
          />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredPosts.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No posts found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm || showMyPosts
              ? 'Try adjusting your filters or search terms'
              : 'Be the first to create a post!'}
          </Typography>
        </Paper>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={viewMode === 'grid' ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr'}
          gap={2}
        >
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, postId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, postId: null })}>Cancel</Button>
          <Button
            onClick={() => deleteDialog.postId && handleDelete(deleteDialog.postId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostList;
