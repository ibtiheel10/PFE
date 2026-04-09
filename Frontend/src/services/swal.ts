import Swal, { type SweetAlertOptions } from 'sweetalert2';

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const icons = {
  success: `<div class="swal-icon-wrap swal-icon-success">
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="25" stroke="#10b981" stroke-width="2" fill="#f0fdf4"/>
      <path d="M14 26l8 8 16-16" stroke="#10b981" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>`,

  error: `<div class="swal-icon-wrap swal-icon-error">
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="25" stroke="#ef4444" stroke-width="2" fill="#fff1f2"/>
      <path d="M18 18l16 16M34 18L18 34" stroke="#ef4444" stroke-width="2.8" stroke-linecap="round"/>
    </svg>
  </div>`,

  warning: `<div class="swal-icon-wrap swal-icon-warning">
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="25" stroke="#f59e0b" stroke-width="2" fill="#fffbeb"/>
      <path d="M26 16v14" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="26" cy="36" r="1.8" fill="#f59e0b"/>
    </svg>
  </div>`,

  info: `<div class="swal-icon-wrap swal-icon-info">
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="25" stroke="#1e40af" stroke-width="2" fill="#eff6ff"/>
      <circle cx="26" cy="17" r="1.8" fill="#1e40af"/>
      <path d="M26 23v13" stroke="#1e40af" stroke-width="2.8" stroke-linecap="round"/>
    </svg>
  </div>`,

  question: `<div class="swal-icon-wrap swal-icon-warning">
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="25" stroke="#f59e0b" stroke-width="2" fill="#fffbeb"/>
      <path d="M20 20.5c0-3.3 2.7-6 6-6s6 2.7 6 6c0 4-6 5-6 9" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="26" cy="37" r="1.8" fill="#f59e0b"/>
    </svg>
  </div>`,
};

// ── Base mixin ─────────────────────────────────────────────────────────────────
const base = Swal.mixin({
  customClass: {
    popup:         'swal-popup',
    title:         'swal-title',
    htmlContainer: 'swal-html',
    confirmButton: 'swal-btn-confirm',
    cancelButton:  'swal-btn-cancel',
  },
  buttonsStyling: false,
  showClass:  { popup: 'swal-show' },
  hideClass:  { popup: 'swal-hide' },
});

// ── Main export — wraps fire() to inject custom iconHtml ───────────────────────
const MySwal = {
  fire(options: SweetAlertOptions & { icon?: 'success' | 'error' | 'warning' | 'info' | 'question' }) {
    const { icon, ...rest } = options;
    return base.fire({
      ...rest,
      iconHtml: icon ? icons[icon] : undefined,
      icon: undefined,
      customClass: {
        popup:         'swal-popup',
        title:         'swal-title',
        htmlContainer: 'swal-html',
        confirmButton: `swal-btn-confirm${icon ? ' swal-btn-' + icon : ''}`,
        cancelButton:  'swal-btn-cancel',
        icon:          'swal-custom-icon-wrapper',
      },
    });
  },
};

export default MySwal;
