import React, { useState, useEffect } from 'react';
import { postsAPI, cacheAPI_service } from '../services/api';

const PostList: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [searchedPost, setSearchedPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useCache, setUseCache] = useState(false);

  const fetchPosts = async (fromCache: boolean = false) => {
    setLoading(true);
    setError('');
    
    try {
      const response = fromCache 
        ? await cacheAPI_service.getAllPosts()
        : await postsAPI.getAllPosts();
      
      const postsData = fromCache ? response.data.data : response.data;
      setPosts(postsData);
    } catch (err: any) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(useCache);
  }, [useCache]);

   const handleSearchById = async () => {
  if (!searchId) return;
  
  try {
    const response = useCache 
      ? await cacheAPI_service.getPost(searchId)
      : await postsAPI.getPost(searchId);
    
    const postData = useCache ? response.data.data : response.data;
    setSearchedPost(postData);
  } catch (err: any) {
    alert('Post not found');
    setSearchedPost(null);
  }
};
 

  const handleToggleCache = (checked: boolean) => {
    setUseCache(checked);
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
            {/* Search by ID section */}
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
    <h3>Search Post by ID</h3>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
        type="number"
        placeholder="Enter Post ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{ padding: '0.5rem' }}
        />
        <button onClick={handleSearchById}>Search</button>
    </div>
    
    {searchedPost && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
        <h4>Found Post:</h4>
        <h5>{searchedPost.title}</h5>
        <p>{searchedPost.content}</p>
        <small>By: {searchedPost.user?.name || searchedPost.user_name}</small>
        </div>
    )}
    </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Posts</h2>
        <div>
          <label style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              checked={useCache}
              onChange={(e) => handleToggleCache(e.target.checked)}
            />
            Use Cache Service
          </label>
          <button onClick={() => fetchPosts(useCache)}>Refresh</button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p>No posts yet. <a href="/create-post">Create your first post!</a></p>
      ) : (
        <div>
          {posts.map((post: any) => (
            <div key={post.id} style={{ 
              border: '1px solid #ddd', 
              padding: '1rem', 
              marginBottom: '1rem',
              borderRadius: '4px'
            }}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>
                By: {post.user?.name || post.user_name || 'Unknown'} | 
                Created: {new Date(post.created_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default PostList;
