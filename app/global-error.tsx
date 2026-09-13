"use client";

import { RotateCcw } from "lucide-react";
import "./globals.css";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="not-found shell">
          <span>PixProMax</span>
          <h1>The application hit an unexpected snag.</h1>
          <p>Your source images remain on your device. Reload the application and continue when you are ready.</p>
          <button className="button primary" type="button" onClick={retry}><RotateCcw /> Reload PixProMax</button>
        </main>
      </body>
    </html>
  );
}
