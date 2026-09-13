import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProcessingButton({ busy, children, onClick, disabled = false }: { busy: boolean; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <Button className="process-button" onClick={onClick} disabled={busy || disabled}>{busy && <LoaderCircle className="spinner" aria-hidden="true" />}{busy ? "Processing…" : children}</Button>;
}
