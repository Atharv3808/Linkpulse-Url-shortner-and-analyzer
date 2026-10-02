import React, { useState, useEffect } from "react";
import { Download, QrCode } from "lucide-react";
import { linksApi } from "../../api/links.api";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner";

export function QRCodeModal({ isOpen, onClose, link }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && link?.id) {
      setIsLoading(true);
      linksApi
        .getQrCodeBlob(link.id)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setQrUrl(url);
        })
        .catch(() => setQrUrl(null))
        .finally(() => setIsLoading(false));
    }
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [isOpen, link]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr_${link?.short_code || "linkpulse"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Short Link QR Code">
      <div className="flex flex-col items-center justify-center space-y-4 text-center py-2">
        {isLoading ? (
          <LoadingSpinner text="Generating QR Code..." />
        ) : qrUrl ? (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-border-subtle">
            <img src={qrUrl} alt="QR Code" className="w-52 h-52 object-contain" />
          </div>
        ) : (
          <div className="p-8 text-xs text-txt-muted">Failed to load QR code.</div>
        )}

        <div className="space-y-1">
          <p className="text-sm font-semibold text-txt-primary">
            {link?.short_code}
          </p>
          <p className="text-xs text-txt-muted max-w-xs truncate">
            {link?.original_url}
          </p>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!qrUrl}
            icon={Download}
          >
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
}
