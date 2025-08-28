import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { isAuthenticated } = useAuth()
  return (
    <header className="">
      {(isAuthenticated && 
      <Navbar />)}
    </header>
  );
}
