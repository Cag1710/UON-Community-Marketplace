import './App.css'
import Layout from './Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ListingsPage from './pages/ListingsPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NavBar from './NavBar';

const routes = [{
  path: '/',
  element: <Layout />,
  children: [{
    path: '/',
    element: <HomePage />
  }, {
    path: '/login',
    element: <LoginPage />
  }, {
    path: '/create-account',
    element: <CreateAccountPage />
  }, {
    path: '/listings',
    element: <ListingsPage />
  }
]
}]


const router = createBrowserRouter(routes);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
