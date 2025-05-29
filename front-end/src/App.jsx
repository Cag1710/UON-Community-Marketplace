import './App.css'
import Layout from './Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ListingsPage from './pages/ListingsPage';
<<<<<<< Updated upstream
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NavBar from './NavBar';
=======
import CreateListingPage from './pages/CreateListingPage';
>>>>>>> Stashed changes

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
  },
  {
    path: '/create-listing',
    element: <CreateListingPage />
  }
<<<<<<< Updated upstream
]
}]
=======
  
  
];
>>>>>>> Stashed changes


const router = createBrowserRouter(routes);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
