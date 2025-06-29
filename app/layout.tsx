import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Phishub - Your Source for Phish Music Resources",
  description:
    "The ultimate resource for learning and sharing Phish songs, tabs, lyrics, and setlists.",
  openGraph: {
    title: "Phishub - Your Source for Phish Music Resources",
    description:
      "The ultimate resource for learning and sharing Phish songs, tabs, lyrics, and setlists.",
    url: "https://phishub.vercel.app",
    siteName: "Phishub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phishub - Your Source for Phish Music Resources",
    description:
      "The ultimate resource for learning and sharing Phish songs, tabs, lyrics, and setlists.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
