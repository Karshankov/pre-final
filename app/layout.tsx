"use client"
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ToastProvider from '@/components/providers/toaster-provider';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { Toaster } from 'sonner';
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { env } from 'process';

const convex = new ConvexReactClient("https://healthy-gull-205.convex.cloud");
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ИОР Аловт',
  description: 'Информационно-образовательный ресурс',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <ConvexClientProvider>
      <html lang="ru">
        <body className={inter.className}>

          <ToastProvider />
          <Toaster position="bottom-center" />
          {children}

        </body>
        
      </html>
      </ConvexClientProvider>
  );
}