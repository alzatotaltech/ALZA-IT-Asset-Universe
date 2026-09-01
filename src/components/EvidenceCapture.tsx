import React, { useRef, useState } from 'react';
import { Camera, FileUp } from 'lucide-react';
import type { EvidenceRecord } from '../types';
import { db } from '../lib/db';
import { nowIso, sha256Blob, uid } from '../lib/utils';
import { saveRecord } from '../lib/cloudSync';
import { useAuth } from '../lib/AuthContext';
import { Button } from './UI';

export function EvidenceCapture({ auditId, controlId, findingId, assetId, onSaved }: { auditId: string; controlId?: string; findingId?: string; assetId?: string; onSaved?(): void }) {
  const { user } = useAuth();
  const photoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length || !user) return;
    setBusy(true);
    try {
      let coords: GeolocationCoordinates | null = null;
      try { coords = await new Promise((resolve, reject) => navigator.geolocation?.getCurrentPosition(p => resolve(p.coords), reject, { timeout: 2500, maximumAge: 60000 })); } catch {}
      for (const file of Array.from(files)) {
        const ts = nowIso();
        const ev: EvidenceRecord = {
          id: uid(), orgId: user.orgId, auditId, controlId, findingId, assetId,
          name: file.name || `evidence-${Date.now()}.jpg`, mimeType: file.type || 'application/octet-stream', size: file.size,
          blob: file, sha256: await sha256Blob(file), capturedAt: ts, createdAt: ts, updatedAt: ts, createdBy: user.id, updatedBy: user.id,
          latitude: coords?.latitude, longitude: coords?.longitude, syncState: 'local'
        };
        await saveRecord('evidence', ev);
      }
      onSaved?.();
    } finally { setBusy(false); }
  }

  return <div className="evidence-actions">
    <input ref={photoRef} hidden type="file" accept="image/*" capture="environment" multiple onChange={e => handleFiles(e.target.files)} />
    <input ref={fileRef} hidden type="file" multiple onChange={e => handleFiles(e.target.files)} />
    <Button type="button" variant="secondary" disabled={busy} onClick={() => photoRef.current?.click()}><Camera size={16}/> Photo</Button>
    <Button type="button" variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()}><FileUp size={16}/> File</Button>
    {busy && <span className="muted">Saving evidence…</span>}
  </div>;
}
