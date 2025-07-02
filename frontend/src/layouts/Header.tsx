import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';

export default function Header() {
  return (
    <header className="bg-blue-200 shadow-md flex justify-between">
      <Navbar />
    </header>
  );
}
