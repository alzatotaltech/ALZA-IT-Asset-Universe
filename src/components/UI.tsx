import React from 'react';
import { X } from 'lucide-react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Button({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'danger'|'ghost' }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input className="input" {...props} />; }
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className="input textarea" {...props} />; }
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select className="input" {...props} />; }

export function Modal({ title, children, onClose, wide = false }: { title: string; children: React.ReactNode; onClose(): void; wide?: boolean }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className={`modal ${wide ? 'modal-wide' : ''}`} onMouseDown={e => e.stopPropagation()}>
    <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={20}/></button></div>
    <div className="modal-body">{children}</div>
  </div></div>;
}

export function RiskBadge({ risk }: { risk: string }) { return <span className={`badge risk-${risk}`}>{risk.replace('_',' ')}</span>; }
export function StatusBadge({ status }: { status: string }) { return <span className={`badge status-${status}`}>{status.replaceAll('_',' ')}</span>; }

export function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className="empty"><div className="empty-icon">◎</div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</div>;
}

export function Stat({ label, value, detail }: { label: string; value: React.ReactNode; detail?: string }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}
