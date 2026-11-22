const SMEC_CSS = `
.smec-seller-bar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 10px 16px; border-radius: 10px; margin-bottom: 16px;
  background: color-mix(in srgb, var(--accent) 8%, var(--card));
  border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
}
.smec-wizard-bar {
  display: grid; grid-template-columns: repeat(5, minmax(130px, 1fr)); gap: 8px; margin-bottom: 16px;
}
@media (max-width: 980px) { .smec-wizard-bar { grid-template-columns: repeat(2, 1fr); } }
.smec-wiz-step {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--card); cursor: pointer; text-align: left;
  color: var(--text); transition: border-color .15s, background .15s;
}
.smec-wiz-step:hover { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); }
.smec-wiz-step.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 11%, var(--card));
}
.smec-wiz-step.done .smec-wiz-num {
  background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok);
}
.smec-wiz-num {
  width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; flex: none;
  font-size: 12px; font-weight: 700;
  background: color-mix(in srgb, var(--muted) 16%, transparent); color: var(--muted);
}
.smec-wiz-step.active .smec-wiz-num { background: var(--accent); color: #fff; }

.smec-ocr-layout {
  display: grid; grid-template-columns: 270px minmax(0, 1fr); gap: 16px; align-items: start;
}
.smec-ocr-layout.with-viewer {
  grid-template-columns: 250px minmax(0, 1fr) 370px;
}
@media (max-width: 1240px) {
  .smec-ocr-layout, .smec-ocr-layout.with-viewer { grid-template-columns: minmax(0, 1fr); }
}

.smec-cat-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 9px 11px; border-radius: 8px; border: 1px solid transparent; background: transparent;
  color: var(--text); cursor: pointer; text-align: left; font-size: 12.5px;
}
.smec-cat-btn:hover { background: color-mix(in srgb, var(--muted) 10%, transparent); }
.smec-cat-btn.active {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  background: color-mix(in srgb, var(--accent) 12%, var(--card));
  font-weight: 600;
}

.smec-field-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 10px; }
.smec-field-card {
  border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--card);
  display: flex; flex-direction: column; gap: 6px;
}
.smec-field-card.tier-needs_confirm { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
.smec-field-card.tier-missing { border-color: color-mix(in srgb, var(--danger) 45%, var(--border)); }

.smec-input {
  width: 100%; padding: 6px 9px; border-radius: 7px; border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 92%, var(--text) 3%); color: var(--text); font-size: 13px;
}
.smec-input:disabled { opacity: 0.72; cursor: not-allowed; }
.smec-textarea {
  width: 100%; min-height: 76px; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--card); color: var(--text); font-size: 13px; font-family: inherit; resize: vertical;
}

.smec-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.smec-table th {
  text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
  color: var(--muted); padding: 8px 10px; border-bottom: 1px solid var(--border);
}
.smec-table td { padding: 8px 10px; border-bottom: 1px solid color-mix(in srgb, var(--border) 65%, transparent); vertical-align: top; }

.smec-pdf-stage {
  position: relative; border-radius: 8px; border: 1px solid var(--border);
  background: #fff; color: #1e293b; min-height: 360px; padding: 18px; overflow: hidden;
}
.smec-bbox-highlight {
  position: absolute; border: 2px solid #eab308; background: rgba(250, 204, 21, 0.28);
  border-radius: 4px; pointer-events: none; box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.16);
}

.smec-action-bar {
  display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--card); margin-bottom: 14px;
}

.smec-qr-box {
  display: inline-flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--card);
}

.smec-dropzone {
  border: 1.5px dashed color-mix(in srgb, var(--accent) 50%, var(--border));
  border-radius: 12px; padding: 22px 16px; text-align: center; cursor: pointer;
  background: color-mix(in srgb, var(--accent) 5%, var(--card));
}
.smec-dropzone:hover { background: color-mix(in srgb, var(--accent) 10%, var(--card)); }

.smec-modal-backdrop {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); z-index: 90;
  display: grid; place-items: center; padding: 20px;
}
.smec-modal {
  width: min(860px, 100%); max-height: 88vh; overflow-y: auto;
  background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px;
}
`

let injected = false
export function ensureSmecStyles(): void {
  if (injected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-sme-connect-styles', '1')
  el.textContent = SMEC_CSS
  document.head.appendChild(el)
  injected = true
}
