import './globals.css'
import ClientLayout from "./clientLayout";
import { Outlet } from 'react-router-dom';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      {/* <ClientLayout><Outlet /></ClientLayout> */}
      <ClientLayout />
    </>
  );
}
