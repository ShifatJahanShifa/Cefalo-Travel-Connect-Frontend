import { getFullYear } from "../utils/fullYear";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      &copy; {getFullYear()} Cefalo Travel Connect. All rights reserved.
    </footer>
  );
}
