import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Button, Modal } from './UI.js';
export function Scanner({ onValue, onClose }) {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let controls;
        const reader = new BrowserMultiFormatReader();
        (async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                const preferred = devices.find(d => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];
                controls = await reader.decodeFromVideoDevice(preferred?.deviceId, videoRef.current, (result) => {
                    if (result) {
                        onValue(result.getText());
                        controls?.stop();
                        onClose();
                    }
                });
            }
            catch (e) {
                setError(e?.message ?? 'Camera unavailable');
            }
        })();
        return () => controls?.stop();
    }, []);
    return _jsxs(Modal, { title: "Scan barcode / QR", onClose: onClose, children: [_jsx("video", { ref: videoRef, className: "scanner-video", muted: true, playsInline: true }), error && _jsx("div", { className: "alert alert-danger", children: error }), _jsx("p", { className: "muted", children: "Point the camera at an asset tag, serial barcode, QR code or label." }), _jsx(Button, { variant: "secondary", onClick: onClose, children: "Cancel" })] });
}
