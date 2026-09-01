import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef, useState } from 'react';
import { Camera, FileUp } from 'lucide-react';
import { nowIso, sha256Blob, uid } from '../lib/utils.js';
import { saveRecord } from '../lib/cloudSync.js';
import { useAuth } from '../lib/AuthContext.js';
import { Button } from './UI.js';
export function EvidenceCapture({ auditId, controlId, findingId, assetId, onSaved }) {
    const { user } = useAuth();
    const photoRef = useRef(null);
    const fileRef = useRef(null);
    const [busy, setBusy] = useState(false);
    async function handleFiles(files) {
        if (!files?.length || !user)
            return;
        setBusy(true);
        try {
            let coords = null;
            try {
                coords = await new Promise((resolve, reject) => navigator.geolocation?.getCurrentPosition(p => resolve(p.coords), reject, { timeout: 2500, maximumAge: 60000 }));
            }
            catch { }
            for (const file of Array.from(files)) {
                const ts = nowIso();
                const ev = {
                    id: uid(), orgId: user.orgId, auditId, controlId, findingId, assetId,
                    name: file.name || `evidence-${Date.now()}.jpg`, mimeType: file.type || 'application/octet-stream', size: file.size,
                    blob: file, sha256: await sha256Blob(file), capturedAt: ts, createdAt: ts, updatedAt: ts, createdBy: user.id, updatedBy: user.id,
                    latitude: coords?.latitude, longitude: coords?.longitude, syncState: 'local'
                };
                await saveRecord('evidence', ev);
            }
            onSaved?.();
        }
        finally {
            setBusy(false);
        }
    }
    return _jsxs("div", { className: "evidence-actions", children: [_jsx("input", { ref: photoRef, hidden: true, type: "file", accept: "image/*", capture: "environment", multiple: true, onChange: e => handleFiles(e.target.files) }), _jsx("input", { ref: fileRef, hidden: true, type: "file", multiple: true, onChange: e => handleFiles(e.target.files) }), _jsxs(Button, { type: "button", variant: "secondary", disabled: busy, onClick: () => photoRef.current?.click(), children: [_jsx(Camera, { size: 16 }), " Photo"] }), _jsxs(Button, { type: "button", variant: "secondary", disabled: busy, onClick: () => fileRef.current?.click(), children: [_jsx(FileUp, { size: 16 }), " File"] }), busy && _jsx("span", { className: "muted", children: "Saving evidence\u2026" })] });
}
