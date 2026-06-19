import { Urbanist, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { CustomScrollbar } from "@/components/ui/CustomScrollbar";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata = {
  title: "Tarun Asthana | Full Stack Web Developer",
  description: "Portfolio of Tarun Asthana, Full Stack Web Developer based in Mumbai, Maharashtra.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${urbanist.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
            <CustomScrollbar />
            <MusicPlayer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
