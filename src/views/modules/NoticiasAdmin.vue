<template>
    <div class="fade-in relative min-h-screen pb-10">
        <!-- Encabezado Estandarizado -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Noticias Relevantes</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Administra las noticias que se muestran en la pantalla de inicio.
                </p>
            </div>
            <div class="flex items-center gap-3 w-full md:w-auto">
                <button @click="abrirModalNuevo"
                    class="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    + Registrar Noticia
                </button>
            </div>
        </div>

        <!-- Contenedor Principal -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            <!-- Cabeceras de Tabla (Solo Desktop) -->
            <div class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/3">Título</div>
                <div class="w-[15%]">Fecha</div>
                <div class="w-[22%]">Categoría</div>
                <div class="w-[15%] text-center">Prioridad</div>
                <div class="w-[15%] text-center">Acciones</div>
            </div>

            <!-- Lista de Noticias (Responsiva) -->
            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <!-- Estados de Carga y Vacío -->
                <div v-if="loading" class="text-center py-12 text-gray-500 flex flex-col items-center">
                    <svg class="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando noticias...
                </div>
                <div v-else-if="noticias.length === 0" class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400">No hay noticias registradas. ¡Crea la primera!</p>
                </div>

                <!-- Iteración de Datos -->
                <div v-else v-for="noticia in noticias" :key="noticia.id"
                    class="p-4 md:px-6 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    
                    <!-- Título -->
                    <div class="w-full md:w-1/3 flex flex-col justify-start">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">Título:</span>
                        <span class="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 md:line-clamp-1">{{ noticia.titulo }}</span>
                    </div>

                    <!-- Fecha -->
                    <div class="w-full md:w-[15%] flex items-center justify-between md:justify-start">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Fecha:</span>
                        <span class="text-gray-600 dark:text-gray-400 text-sm">{{ noticia.fecha_etiqueta }}</span>
                    </div>

                    <!-- Categoría -->
                    <div class="w-full md:w-[22%] flex items-center justify-between md:justify-start">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Categoría:</span>
                        <span :class="`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-${noticia.categoria_color}-600 bg-${noticia.categoria_color}-50 dark:text-${noticia.categoria_color}-400 dark:bg-${noticia.categoria_color}-900/30`">
                            {{ noticia.categoria_texto }}
                        </span>
                    </div>

                    <!-- Prioridad -->
                    <div class="w-full md:w-[15%] flex items-center justify-between md:justify-center">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Prioridad:</span>
                        <span v-if="noticia.prioridad === 1" class="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md text-xs font-bold">Alta</span>
                        <span v-else-if="noticia.prioridad === 2" class="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md text-xs font-bold">Media</span>
                        <span v-else class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-xs font-bold">Normal</span>
                    </div>

                    <!-- Acciones -->
                    <div class="flex items-center gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 w-full md:w-[15%] justify-end md:justify-center shrink-0">
                        <button @click="abrirModalEditar(noticia)"
                            class="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Editar">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </button>
                        <button @click="borrarNoticia(noticia.id)"
                            class="flex items-center gap-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Eliminar">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Formulario Estandarizado -->
        <div :class="['fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6', showModal ? 'pointer-events-auto' : 'pointer-events-none']">
            
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showModal" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="cerrarModal"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-if="showModal" class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-700">
                    
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 rounded-t-2xl">
                        <h2 class="text-lg font-bold text-gray-800 dark:text-white">{{ isEditing ? 'Editar Noticia' : 'Registrar Noticia' }}</h2>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto space-y-5">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título</label>
                            <input v-model="form.titulo" type="text"
                                class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                placeholder="Ej. Tercera Sesión Ordinaria">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción</label>
                            <textarea v-model="form.descripcion" rows="4"
                                class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                placeholder="Detalles de la noticia..."></textarea>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha</label>
                                <input v-model="form.fecha_etiqueta" type="date"
                                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
                                <input v-model="form.categoria_texto" type="text"
                                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    placeholder="Ej. Aviso">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color Categoría</label>
                                <select v-model="form.categoria_color"
                                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    <option value="blue">Azul</option>
                                    <option value="indigo">Índigo</option>
                                    <option value="emerald">Esmeralda (Verde)</option>
                                    <option value="amber">Ámbar (Naranja)</option>
                                    <option value="red">Rojo</option>
                                    <option value="purple">Morado</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prioridad</label>
                                <select v-model.number="form.prioridad"
                                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    <option :value="1">Alta (Primera)</option>
                                    <option :value="2">Media (Segunda)</option>
                                    <option :value="3">Normal (Tercera)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-900/40 rounded-b-2xl">
                        <button @click="cerrarModal"
                            class="flex-1 py-2.5 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button @click="guardar" :disabled="procesando"
                            class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50">
                            {{ procesando ? 'Guardando...' : (isEditing ? 'Modificar' : 'Guardar') }}
                        </button>
                    </div>

                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { noticiasService } from '@/services/noticiasService'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const noticias = ref([])
const loading = ref(true)

// Estado del Modal
const showModal = ref(false)
const isEditing = ref(false)
const procesando = ref(false)
const currentId = ref(null)

const form = reactive({
    titulo: '',
    descripcion: '',
    fecha_etiqueta: '',
    categoria_texto: '',
    categoria_color: 'blue',
    prioridad: 1
})

const cargarNoticias = async () => {
    loading.value = true
    try {
        noticias.value = await noticiasService.obtenerTodas()
    } catch (error) {
        toast.error('Error al cargar las noticias.')
        console.error(error)
    } finally {
        loading.value = false
    }
}

// === LÓGICA DE TECLADO ===
const handleKeydown = (e) => {
    if (e.key === 'Escape' && showModal.value) {
        cerrarModal()
    }
}

const abrirModalNuevo = () => {
    isEditing.value = false
    currentId.value = null
    Object.assign(form, { titulo: '', descripcion: '', fecha_etiqueta: '', categoria_texto: '', categoria_color: 'blue', prioridad: 1 })
    showModal.value = true
}

const abrirModalEditar = (noticia) => {
    isEditing.value = true
    currentId.value = noticia.id
    Object.assign(form, {
        titulo: noticia.titulo,
        descripcion: noticia.descripcion,
        fecha_etiqueta: noticia.fecha_etiqueta,
        categoria_texto: noticia.categoria_texto,
        categoria_color: noticia.categoria_color,
        prioridad: noticia.prioridad || 1
    })
    showModal.value = true
}

const cerrarModal = () => {
    showModal.value = false
}

const guardar = async () => {
    if (!form.titulo || !form.descripcion || !form.fecha_etiqueta || !form.categoria_texto) {
        return toast.error('Por favor, completa todos los campos.')
    }

    procesando.value = true
    try {
        if (isEditing.value) {
            await noticiasService.actualizar(currentId.value, form)
            toast.success('Noticia actualizada con éxito')
        } else {
            await noticiasService.crear(form)
            toast.success('Noticia creada con éxito')
        }
        cerrarModal()
        cargarNoticias()
    } catch (error) {
        toast.error('Error al guardar la noticia')
        console.error(error)
    } finally {
        procesando.value = false
    }
}

const borrarNoticia = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.')) {
        try {
            await noticiasService.eliminar(id)
            toast.success('Noticia eliminada')
            cargarNoticias()
        } catch (error) {
            toast.error('Error al eliminar la noticia')
            console.error(error)
        }
    }
}

onMounted(() => {
    cargarNoticias()
    document.addEventListener('keydown', handleKeydown)
})

// Safelist virtual para Tailwind v4 
const tailwindSafelist = [
    'text-blue-600', 'bg-blue-50', 'dark:text-blue-400', 'dark:bg-blue-900/30',
    'text-indigo-600', 'bg-indigo-50', 'dark:text-indigo-400', 'dark:bg-indigo-900/30',
    'text-emerald-600', 'bg-emerald-50', 'dark:text-emerald-400', 'dark:bg-emerald-900/30',
    'text-amber-600', 'bg-amber-50', 'dark:text-amber-400', 'dark:bg-amber-900/30',
    'text-red-600', 'bg-red-50', 'dark:text-red-400', 'dark:bg-red-900/30',
    'text-purple-600', 'bg-purple-50', 'dark:text-purple-400', 'dark:bg-purple-900/30',
];
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>