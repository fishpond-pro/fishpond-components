import './globals.css'
import ClientLayout from "./clientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
