import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/post/home'
import CreatePostPage from '../pages/post/createPost';
import LandingPage from '../pages/LandingPage'
import SignupPage from '../pages/auth/signup';
import SigninPage from '../pages/auth/signin';
import PrivateRoute from './privateRoute';
import EditPostPage from '../pages/post/editPost';
import ViewPost from '../pages/post/viewPost';
import ProfilePage from '../pages/profile';
import Dashboard from '../pages/dashboard/dashboard';
import WishlistPage from '../pages/wishlist/wishlist';
import CreateWishlistPage from '../pages/wishlist/createWishlist';
import WishlistMapSelector from '../pages/wishlist/wishlistMap';
import ViewWishlistPage from '../pages/wishlist/viewWishlist';
import EditWishlistPage from '../pages/wishlist/editWishlist';
import ViewSingleWishlist from '../pages/wishlist/singleWishlistView';
import TravelPlanListPage from '../pages/travelplan/travelPlan';
import TravelPlanForm from '../pages/travelplan/createTravelPlan';
import TravelPlanMapSelector from '../pages/travelplan/travelPlanMap';
import TravelPlanEditPage from '../pages/travelplan/editTravelPlan';
import ViewTravelPlan from '../pages/travelplan/viewTravelPLan';
import TravelPlanDiscussion from '../pages/travelplan/travelPlanComment';
import SeeNearbyPage from '../pages/seeNearby';
import TravelPlanInvitationsPage from '../pages/travelplan/travelPlanInvitation';
import AdminDashboard from '../pages/dashboard/adminDashboard';
import PostMapSelector from '../pages/post/postMap';
import PlacesPage from '../pages/place';
import NotificationsPage from '../pages/notification';
import { useAuth } from '../hooks/useAuth';

export default function AppRoutes() {
    const { role } = useAuth();
    const isAdmin = role === 'admin';
    return (
        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/signup' element={<SignupPage />} /> 
            <Route path='/signin' element={<SigninPage /> } /> 

            <Route path="/home" element={<PrivateRoute><HomePage /> </PrivateRoute>} />
            <Route path='/posts/create' element={<PrivateRoute><CreatePostPage/></PrivateRoute>} /> 
            <Route path='/places' element={<PrivateRoute>< PlacesPage/></PrivateRoute>} />
            <Route path='/wishlists' element={<PrivateRoute>< WishlistPage/></PrivateRoute>} />
            <Route path='/travelplans' element={<PrivateRoute>< TravelPlanListPage /></PrivateRoute>} />
            <Route path='/nearby' element={<PrivateRoute>< SeeNearbyPage/></PrivateRoute>} />
            <Route path='/profile' element={<PrivateRoute>< ProfilePage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute> {isAdmin ? <AdminDashboard /> : <Dashboard />} </PrivateRoute>}/>

            <Route path='/post/map' element={<PrivateRoute> < PostMapSelector/></PrivateRoute>} />
            <Route path='/posts/:post_id/edit' element={<PrivateRoute>< EditPostPage/></PrivateRoute>} /> 
            <Route path='/posts/:post_id/view' element={<PrivateRoute> < ViewPost/></PrivateRoute>} />

            <Route path='/wishlists/create' element={<PrivateRoute><  CreateWishlistPage/></PrivateRoute>} />

            <Route path='/wishlist/map' element={<PrivateRoute> < WishlistMapSelector/></PrivateRoute>} />
            <Route path='/wishlists/:wishlist_id/view' element={<PrivateRoute>< ViewWishlistPage/></PrivateRoute>} /> 
            <Route path='/wishlists/:wishlist_id/edit' element={<PrivateRoute>< EditWishlistPage/></PrivateRoute>} />
            <Route path='/shared/wishlists/:wishlist_id' element={< ViewSingleWishlist/ >}  />

            <Route path='/travelplans/create' element={<PrivateRoute><TravelPlanForm/> </PrivateRoute>} />
            <Route path='/travelplans/invitations' element={<PrivateRoute>< TravelPlanInvitationsPage/></PrivateRoute>} />
            <Route path='/travelplan/map' element={<PrivateRoute>< TravelPlanMapSelector/></PrivateRoute>} />
            <Route path='/travelplans/:travel_plan_id/view' element={<PrivateRoute>< ViewTravelPlan/></PrivateRoute>} /> 
            <Route path='/travelplans/:travel_plan_id/edit' element={<PrivateRoute>< TravelPlanEditPage/></PrivateRoute>} /> 
            <Route path='/travelplans/:travel_plan_id/comments' element={<PrivateRoute> < TravelPlanDiscussion/></PrivateRoute>} />

            <Route path='/notifications' element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        </Routes>
    );
}
