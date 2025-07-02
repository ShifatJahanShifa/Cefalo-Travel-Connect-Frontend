import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About';
import CreatePostPage from '../pages/posts/createPost';
import LandingPage from '../pages/LandingPage';
import Navbar from '../components/navBar';
import SignupPage from '../pages/signup';
import SigninPage from '../pages/signin';
import PrivateRoute from './privateRoute';


// i will keep track of my routes in this file 
export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/signup' element={<SignupPage />} /> 
            <Route path='/signin' element={<SigninPage /> } /> 

            <Route path="/home" element={<PrivateRoute><HomePage /> </PrivateRoute>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path='/create-post' element={<PrivateRoute><CreatePostPage/></PrivateRoute>} />
        </Routes>
    );
}
