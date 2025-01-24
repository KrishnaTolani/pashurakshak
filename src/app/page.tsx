import { redirect } from 'next/navigation';
// import Image from "next/image";

export default async function HomePage() {
  // For now, we redirect to dashboard
  // In future, this will check auth status and redirect accordingly
  return redirect('/dashboard');
}
