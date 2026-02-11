import Header from './Header';
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#7a5c40', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <main style={{ minHeight: '100%' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
