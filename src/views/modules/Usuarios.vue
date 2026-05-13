<template>
  <div class="fade-in relative min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>
      <button 
        @click="abrirPanelNuevo"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md"
      >
        + Nuevo Usuario
      </button>
    </div>

    <div class="space-y-4">
      
      <div 
        v-for="user in listaUsuarios" 
        :key="user.id" 
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
      >
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg truncate">{{ user.nombre }}</h3>
            <span 
              :class="user.rol === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'" 
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              {{ user.rol }}
            </span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
        </div>

        <div class="flex-1">
          <p class="text-xs text-gray-400 uppercase font-semibold mb-1.5 md:hidden">Permisos Asignados</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-if="!user.secciones_permitidas || user.secciones_permitidas.length === 0" class="text-xs text-gray-400 italic">
              Sin accesos
            </span>
            <span 
              v-for="sec in user.secciones_permitidas" 
              :key="sec" 
              class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600"
            >
              {{ sec }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 w-full md:w-auto justify-end shrink-0">
          <button 
            @click="abrirPanelEdicion(user)" 
            class="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Editar
          </button>
          <button 
            @click="eliminarUser(user.id)" 
            class="flex items-center gap-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Eliminar
          </button>
        </div>

      </div>
      
      <div v-if="listaUsuarios.length === 0" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">No hay usuarios registrados.</p>
      </div>

    </div>

    <div :class="['fixed inset-0 z-50 overflow-hidden', panelAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
      
      <transition
        enter-active-class="ease-in-out duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in-out duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="panelAbierto" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="cerrarPanel"></div>
      </transition>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <transition 
          enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-if="panelAbierto" class="relative w-screen max-w-md h-full flex flex-col bg-white dark:bg-gray-800 shadow-2xl">
            
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/40">
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">{{ editandoId ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
              <button @click="cerrarPanel" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Datos Principales</label>
                <div class="space-y-4">
                  <input 
                    v-model="form.email" 
                    type="email" 
                    placeholder="Correo de Google" 
                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed" 
                    :disabled="editandoId"
                  >
                  <input 
                    v-model="form.nombre" 
                    type="text" 
                    placeholder="Nombre completo" 
                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                  <select 
                    v-model="form.rol" 
                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-4">Secciones Permitidas (Lista Blanca)</label>
                <div class="grid grid-cols-1 gap-2">
                  <label v-for="sec in todasLasSecciones" :key="sec.codigo" class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors duration-200">
                    <input type="checkbox" :value="sec.codigo" v-model="form.secciones_permitidas" class="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ sec.codigo }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ sec.seccion }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-900/40">
              <button @click="cerrarPanel" class="flex-1 py-2 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
              <button @click="guardarUsuario" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transform transition-all active:scale-95">
                {{ editandoId ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
            
          </div>
        </transition>
      </div>
    </div>
    <ConfirmModal 
      :isOpen="modalEliminar.abierto"
      title="Eliminar Acceso"
      message="¿Estás seguro de que deseas revocar los permisos de este usuario? Ya no podrá acceder al sistema."
      confirmText="Sí, eliminar"
      @confirm="confirmarEliminacion"
      @cancel="cancelarEliminacion"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const ConfirmModal = defineAsyncComponent(() => import('@/components/ConfirmModal.vue'))
const listaUsuarios = ref([])
const todasLasSecciones = ref([])
const panelAbierto = ref(false)
const editandoId = ref(null)
const toast = useToast()

const form = ref({
  email: '',
  nombre: '',
  rol: 'cliente',
  secciones_permitidas: []
})

// Cargar Datos
const cargarDatos = async () => {
  // Cargar Usuarios
  const { data: users } = await supabase.from('usuarios').select('*').order('nombre')
  listaUsuarios.value = users || []

  // Cargar Secciones para los Checkboxes (de la tabla cuadro_general)
  const { data: sections } = await supabase.from('cuadro_general').select('codigo, seccion').order('codigo')
  todasLasSecciones.value = sections || []
}

onMounted(cargarDatos)

const abrirPanelNuevo = () => {
  editandoId.value = null
  form.value = { email: '', nombre: '', rol: 'cliente', secciones_permitidas: [] }
  panelAbierto.value = true
}

const abrirPanelEdicion = (user) => {
  editandoId.value = user.id
  form.value = { ...user }
  panelAbierto.value = true
}

const cerrarPanel = () => {
  panelAbierto.value = false
}

const guardarUsuario = async () => {
  // 1. Validación de campos vacíos
  if (!form.value.email || !form.value.nombre) {
    return toast.error('El nombre y el correo son obligatorios')
  }

  // 2. Validación de formato de correo (Regex)
  // Esta regla exige: texto + @ + texto + . + texto (sin espacios)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email.trim())) {
    return toast.error('Por favor, ingresa un correo electrónico válido (ej. usuario@ejemplo.com)')
  }

  let dbError = null

  // Limpiamos los espacios en blanco accidentales antes de guardar
  const payload = {
    ...form.value,
    email: form.value.email.trim(),
    nombre: form.value.nombre.trim()
  }

  // 3. Persistencia en Base de Datos
  if (editandoId.value) {
    const { error } = await supabase.from('usuarios').update(payload).eq('id', editandoId.value)
    dbError = error
  } else {
    const { error } = await supabase.from('usuarios').insert([payload])
    dbError = error
  }

  // 4. Manejo de Errores y Éxito
  if (dbError) {
    // Si Supabase detecta que el correo ya existe por la regla UNIQUE, lanzará un error
    if (dbError.code === '23505') { // Código de error de PostgreSQL para "Unique Violation"
      return toast.error('Este correo ya está registrado en el sistema')
    }
    return toast.error(dbError.message || 'Error al guardar el usuario')
  }

  toast.success(editandoId.value ? 'Usuario actualizado correctamente' : 'Usuario registrado con éxito')
  await cargarDatos()
  cerrarPanel()
}

const modalEliminar = ref({
  abierto: false,
  usuarioId: null
})

const eliminarUser = (id) => {
  modalEliminar.value = {
    abierto: true,
    usuarioId: id
  }
}

const confirmarEliminacion = async () => {
  if (modalEliminar.value.usuarioId) {
    const { error } = await supabase.from('usuarios').delete().eq('id', modalEliminar.value.usuarioId)
    if (error) {
      toast.error(error.message || 'Error al intentar eliminar el usuario')
    } else {
      toast.success('Acceso revocado correctamente')
      await cargarDatos()
    }
  }
  // Cerramos el modal independientemente del resultado
  modalEliminar.value.abierto = false
}

const cancelarEliminacion = () => {
  modalEliminar.value.abierto = false
}

// Función para manejar el cierre del panel lateral con ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    // Solo cerramos el panel lateral si está abierto Y el modal de eliminar no lo está
    if (panelAbierto.value && !modalEliminar.value.abierto) {
      cerrarPanel()
    }
  }
}

onMounted(async () => {
  await cargarDatos()
  document.addEventListener('keydown', handleKeydown) // Registrar tecla
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown) // Limpiar memoria
})

</script>