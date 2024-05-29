import React from "react";
import { Inter } from "next/font/google";
import { Header } from "./components/templates/header"
import { links } from "./config/links";
import "./globals.css";
import { metadata } from "./config/metadata";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className = "w-full h-full bg-slate-100">
      <body className = "flex flex-col h-full">
        <Header title = {metadata.title as String} description = {metadata.description as String} links = {links}  />
        <div className="grow h-full overflow-y-auto flex-col justify-center items-center">
          <main className={inter.className + 'h-full'}>{children}</main>
        </div>
      </body>
    </html>
  );
}
