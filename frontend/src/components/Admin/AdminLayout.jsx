import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        marginLeft: '250px',
        flex: 1,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;