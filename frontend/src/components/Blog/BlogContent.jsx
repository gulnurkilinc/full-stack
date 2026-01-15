// src/components/Blog/BlogContent.jsx
import React from 'react';

const BlogContent = ({ content, excerpt }) => {
  if (!content) return null;

  return (
    <div style={styles.container}>
      {excerpt && (
        <div style={styles.excerpt}>{excerpt}</div>
      )}
      <div 
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '40px'
  },
  excerpt: {
    fontSize: '20px',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '30px',
    paddingLeft: '20px',
    borderLeft: '4px solid #007bff'
  },
  content: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#333'
  }
};

export default BlogContent;