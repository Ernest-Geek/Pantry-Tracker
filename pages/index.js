// pages/index.js
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to the Pantry App</h1>
        <Link href="/pantry">Go to Pantry</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </main>
      <Footer />
    </div>
  );
}

