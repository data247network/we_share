import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WeShare — Buy together. Save together.",
  description:
    "Local shops list wholesale cases. Pool with neighbours, save 20–35%, and get each share delivered.",
  keywords: ["wholesale", "group buying", "food sharing", "community"],
  openGraph: {
    title: "WeShare",
    description: "Buy together. Save together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '0c9068bd-ca68-424f-acaa-ca501f4b3f44'}",
                safari_web_id: "web.onesignal.auto.weshare",
                notifyButton: { enable: false },
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `,
        }}
      />
      <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer />
      <style>{`
        :root {
          --font-serif: var(--font-newsreader), ui-serif, Georgia, serif;
          --font-sans: var(--font-jakarta), system-ui, sans-serif;
          --font-mono: var(--font-mono), ui-monospace, monospace;
        }
        body {
          font-family: var(--font-jakarta), system-ui, sans-serif;
        }
      `}</style>
      <body>{children}</body>
    </html>
  );
}
