import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About';
import CreatePostPage from '../pages/posts/createPost';
import LandingPage from '../pages/LandingPage';
import Navbar from '../components/navBar';

// i will keep track of my routes in this file 
export default function AppRoutes() {
//     const location = useLocation();
//   const hideNavbarRoutes = ["/get-started"];
  return (
    <>
    {/* {!hideNavbarRoutes.includes(location.pathname) && <Navbar />} */}
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path='/create-post' element={<CreatePostPage/>} />
    </Routes>
    </>
  );
}
