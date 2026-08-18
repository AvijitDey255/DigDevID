import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/Provider";
import { Toaster } from "react-hot-toast";
import InitUser from "@/InitUser";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Digital ID",
  description: "Create and share your digital profile.",
  applicationName: "Digital ID",

  authors: [
    {
      name: "Avijit Dey",
    },
  ],

  creator: "Avijit Dey",

  icons: {
    icon: "/logo.png",
  },

  openGraph: {
    title: "Digital ID",
    description: "Your digital profile, portfolio and identity.",
    siteName: "Digital ID",
    type: "website",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <Toaster />
          <InitUser />
          {children}
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}
