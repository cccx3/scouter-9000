
import Home from "./pages/Home"
import About from "./pages/About"
import Profile, { loader as profileLoader } from "./pages/Profile"
import AppLayout from './ui/AppLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';




const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/profile/:user',
        element: <Profile />,
        loader: profileLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
