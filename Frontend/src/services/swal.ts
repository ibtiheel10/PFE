import Swal from 'sweetalert2';

const MySwal = Swal.mixin({
  customClass: {
    popup:          'swal-popup',
    title:          'swal-title',
    htmlContainer:  'swal-html',
    confirmButton:  'swal-btn-confirm',
    cancelButton:   'swal-btn-cancel',
    icon:           'swal-icon',
  },
  buttonsStyling: false,
  showClass: {
    popup: 'swal-show',
  },
  hideClass: {
    popup: 'swal-hide',
  },
});

export default MySwal;
