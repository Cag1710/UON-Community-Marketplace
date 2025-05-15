import './App.css'
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoggedOutHome from './pages/LoggedOutHome';
import LoggedInHome from './pages/LoggedInHome'; 

const routes = [
  {
    path: '/',
    element: <LoggedInHome />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/create-account',
    element: <CreateAccountPage />
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
