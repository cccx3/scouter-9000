import Header from './Header';
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1815', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
