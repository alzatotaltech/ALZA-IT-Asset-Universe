import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Button, Modal } from './UI';

export function Scanner({ onValue, onClose }: { onValue(value: string): void; onClose(): void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let controls: { stop(): void } | undefined;
    const reader = new BrowserMultiFormatReader();
    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const preferred = devices.find(d => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];
        controls = await reader.decodeFromVideoDevice(preferred?.deviceId, videoRef.current!, (result) => {
          if (result) { onValue(result.getText()); controls?.stop(); onClose(); }
        });
      } catch (e: any) { setError(e?.message ?? 'Camera unavailable'); }
    })();
    return () => controls?.stop();
  }, []);
  return <Modal title="Scan barcode / QR" onClose={onClose}>
    <video ref={videoRef} className="scanner-video" muted playsInline />
    {error && <div className="alert alert-danger">{error}</div>}
    <p className="muted">Point the camera at an asset tag, serial barcode, QR code or label.</p>
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
  </Modal>;
}
