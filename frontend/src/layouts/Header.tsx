import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';

export default function Header() {
  return (
    <header className="bg-blue-100 p-4 shadow-md flex justify-between">
      <Navbar />
    </header>
  );
}
