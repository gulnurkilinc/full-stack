// src/pages/Admin/Dashboard.jsx
import React from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Dashboard</h1>
        <p style={{ color: '#666' }}>Admin paneline hoş geldiniz!</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Toplam Blog</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>24</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Toplam Görüntülenme</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>1,234</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Aktif Kullanıcı</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>56</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;