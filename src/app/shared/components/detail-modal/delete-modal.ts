import Swal from 'sweetalert2';

export function showDeleteModal(itemName: string, onConfirm: () => void) {
  Swal.fire({
    title: `¿Estás seguro de que quieres borrar "${itemName}"?`,
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire(
        'Eliminado',
        `"${itemName}" ha sido eliminado exitosamente.`,
        'success'
      );
    }
  });
}
