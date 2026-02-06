import Header from './Header';
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#7a5c40' }}>
      <Header />
      
      <div style={{ overflow: 'auto' }}>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;