import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NGO Registration - Pashurakshak',
  description: 'Register your NGO with Pashurakshak to help animals in need',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 