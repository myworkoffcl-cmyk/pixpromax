"use client";
import { RotateCcw } from "lucide-react";
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) { return <section className="not-found shell"><span>Oops</span><h1>Something interrupted the edit.</h1><p>Your original image is still on your device. Try rendering this page again.</p><button className="button primary" type="button" onClick={retry}><RotateCcw /> Try again</button></section>; }
