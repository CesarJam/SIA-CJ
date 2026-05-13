import { ref } from 'vue'

// Estado global reactivo: Este arreglo vivirá fuera del componente, 
// por lo que todos los módulos compartirán la misma lista de notificaciones.
const toasts = ref([])
let toastId = 0

export function useToast() {
  const addToast = ({ message, type = 'success', duration = 3000 }) => {
    const id = toastId++
    
    toasts.value.push({ id, message, type })

    // Auto-eliminar después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Métodos de acceso rápido
  const success = (message, duration) => addToast({ message, type: 'success', duration })
  const error = (message, duration) => addToast({ message, type: 'error', duration })
  const info = (message, duration) => addToast({ message, type: 'info', duration })

  return {
    toasts,
    removeToast,
    success,
    error,
    info
  }
}