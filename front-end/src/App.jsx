import './App.css'
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import MessagePage from './pages/MessagePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage';

const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/create-account',
    element: <CreateAccountPage />
  },
  {
    path: '/messages',
    element: <MessagePage />
  }
];


const router = createBrowserRouter(routes);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
