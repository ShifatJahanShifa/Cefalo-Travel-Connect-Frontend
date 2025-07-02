import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About';
import CreatePostPage from '../pages/createPost';
import LandingPage from '../pages/LandingPage';
import Navbar from '../components/navBar';
import SignupPage from '../pages/signup';
import SigninPage from '../pages/signin';
import PrivateRoute from './privateRoute';
import EditPostPage from '../pages/editPost';
import ViewPost from '../pages/viewPost';
import ProfilePage from '../pages/profile';
import Dashboard from '../pages/dashboard';
import WishlistPage from '../pages/wishlist';
import MapSelectorPage from '../pages/map';


export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/signup' element={<SignupPage />} /> 
            <Route path='/signin' element={<SigninPage /> } /> 

            <Route path="/about" element={<AboutPage />} />

            <Route path="/home" element={<PrivateRoute><HomePage /> </PrivateRoute>} />
            <Route path='/create-post' element={<PrivateRoute><CreatePostPage/></PrivateRoute>} /> 
            <Route path='/profile' element={<PrivateRoute>< ProfilePage /></PrivateRoute>} />
            <Route path='/posts/:post_id/edit' element={<PrivateRoute>< EditPostPage/></PrivateRoute>} /> 
            <Route path='/posts/:post_id/view' element={<PrivateRoute> < ViewPost/></PrivateRoute>} />
            <Route path='/dashboard' element={<PrivateRoute>< Dashboard/></PrivateRoute>} />
            <Route path='/wishlists' element={<PrivateRoute>< WishlistPage/></PrivateRoute>} />
            <Route path='/map' element={<PrivateRoute>< MapSelectorPage/></PrivateRoute>} />
        </Routes>
    );
}
