// src/components/Blog/RelatedPosts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RelatedPosts = ({ category, currentBlogId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axios.get(`/api/blogs?category=${category}&limit=3`);
        const filtered = response.data.filter(post => post._id !== currentBlogId);
        setPosts(filtered.slice(0, 3));
      } catch (err) {
        console.error('Related posts error:', err);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentBlogId]);

  if (posts.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>İlgili Yazılar</h3>
      <div style={styles.grid}>
        {posts.map(post => (
          <Link 
            key={post._id} 
            to={`/blog/${post.slug}`}
            style={styles.card}
          >
            {post.coverImage?.url && (
              <img 
                src={post.coverImage.url} 
                alt={post.title}
                style={styles.image}
              />
            )}
            <h4 style={styles.postTitle}>{post.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '60px',
    paddingTop: '40px',
    borderTop: '2px solid #e0e0e0'
  },
  title: {
    fontSize: '28px',
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.3s'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  postTitle: {
    padding: '15px',
    fontSize: '16px',
    fontWeight: '500'
  }
};

export default RelatedPosts;