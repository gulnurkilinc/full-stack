// src/components/Blog/BlogMeta.jsx
import React from 'react';

const BlogMeta = ({ blog }) => {
  if (!blog) return null;

  const readingTime = blog.content 
    ? Math.ceil(blog.content.split(/\s+/).length / 200) 
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.metaItem}>
        <span>👤 {blog.author?.name || 'Anonim'}</span>
      </div>
      <div style={styles.metaItem}>
        <span>📅 {new Date(blog.publishedAt).toLocaleDateString('tr-TR')}</span>
      </div>
      <div style={styles.metaItem}>
        <span>⏱️ {readingTime} dk okuma</span>
      </div>
      {blog.category && (
        <div style={styles.category}>
          {blog.category}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  metaItem: {
    fontSize: '14px',
    color: '#666'
  },
  category: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  }
};

export default BlogMeta;