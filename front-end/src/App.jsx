import './App.css'
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import MessagePage from './pages/MessagePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import AdminPortalPage from './pages/AdminPortalPage';
import ListingDetailPage from './pages/ListingDetailPage';
import PrivacyPolicy from './pages/PrivacyPolicy';

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
    path: '/listings',
    element: <ListingsPage />
  },
  {
    path: '/create-listing',
    element: <CreateListingPage />
  },
  {
    path: '/messages',
    element: <MessagePage />
  },
  {
    path: 'forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/admin-portal',
    element: <AdminPortalPage />
  },
  {
    path: '/listing/:id', 
    element: <ListingDetailPage />
  },
  {
  path: '/privacy-policy',
  element: <PrivacyPolicy />
  },

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
