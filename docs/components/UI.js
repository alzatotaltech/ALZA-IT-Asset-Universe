import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { X } from 'lucide-react';
export function Card({ children, className = '' }) {
    return _jsx("section", { className: `card ${className}`, children: children });
}
export function Button({ children, variant = 'primary', className = '', ...props }) {
    return _jsx("button", { className: `btn btn-${variant} ${className}`, ...props, children: children });
}
export function Field({ label, children, hint }) {
    return _jsxs("label", { className: "field", children: [_jsx("span", { children: label }), children, hint && _jsx("small", { children: hint })] });
}
export function TextInput(props) { return _jsx("input", { className: "input", ...props }); }
export function TextArea(props) { return _jsx("textarea", { className: "input textarea", ...props }); }
export function Select(props) { return _jsx("select", { className: "input", ...props }); }
export function Modal({ title, children, onClose, wide = false }) {
    return _jsx("div", { className: "modal-backdrop", onMouseDown: onClose, children: _jsxs("div", { className: `modal ${wide ? 'modal-wide' : ''}`, onMouseDown: e => e.stopPropagation(), children: [_jsxs("div", { className: "modal-head", children: [_jsx("h2", { children: title }), _jsx("button", { className: "icon-btn", onClick: onClose, children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "modal-body", children: children })] }) });
}
export function RiskBadge({ risk }) { return _jsx("span", { className: `badge risk-${risk}`, children: risk.replace('_', ' ') }); }
export function StatusBadge({ status }) { return _jsx("span", { className: `badge status-${status}`, children: status.replaceAll('_', ' ') }); }
export function Empty({ title, text, action }) {
    return _jsxs("div", { className: "empty", children: [_jsx("div", { className: "empty-icon", children: "\u25CE" }), _jsx("h3", { children: title }), _jsx("p", { children: text }), action] });
}
export function PageHeader({ title, subtitle, actions }) {
    return _jsxs("div", { className: "page-header", children: [_jsxs("div", { children: [_jsx("h1", { children: title }), subtitle && _jsx("p", { children: subtitle })] }), actions && _jsx("div", { className: "page-actions", children: actions })] });
}
export function Stat({ label, value, detail }) {
    return _jsxs("div", { className: "stat", children: [_jsx("span", { children: label }), _jsx("strong", { children: value }), detail && _jsx("small", { children: detail })] });
}
