<template>
    <div class="fade-in space-y-6 pb-10">
        <!-- Encabezado -->
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Noticias Relevantes</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Administra las noticias que se muestran en la pantalla de inicio.</p>
            </div>
            <button @click="abrirModalNuevo"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nueva Noticia
            </button>
        </div>

        <!-- Tabla de Noticias -->
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">
                Cargando noticias...
            </div>
            <div v-else-if="noticias.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
                No hay noticias registradas. ¡Crea la primera!
            </div>
            <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                            <th class="p-4 font-semibold">Título</th>
                            <th class="p-4 font-semibold">Etiqueta Fecha</th>
                            <th class="p-4 font-semibold">Categoría</th>
                            <th class="p-4 font-semibold text-center">Prioridad</th>
                            <th class="p-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="noticia in noticias" :key="noticia.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td class="p-4 text-gray-800 dark:text-gray-200 font-medium">{{ noticia.titulo }}</td>
                            <td class="p-4 text-gray-600 dark:text-gray-400">{{ noticia.fecha_etiqueta }}</td>
                            <td class="p-4">
                                <span
                                    :class="`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-${noticia.categoria_color}-600 bg-${noticia.categoria_color}-50 dark:text-${noticia.categoria_color}-400 dark:bg-${noticia.categoria_color}-900/30`">
                                    {{ noticia.categoria_texto }}
                                </span>
                            </td>
                            <!-- COLUMNA DE PRIORIDAD ACTUALIZADA -->
                            <td class="p-4 text-center font-bold">
                                <span v-if="noticia.prioridad === 1"
                                    class="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md text-xs">
                                    Alta
                                </span>
                                <span v-else-if="noticia.prioridad === 2"
                                    class="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md text-xs">
                                    Media
                                </span>
                                <span v-else
                                    class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-xs">
                                    Normal
                                </span>
                            </td>
                            <td class="p-4 flex justify-center gap-2">
                                <button @click="abrirModalEditar(noticia)"
                                    class="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors"
                                    title="Editar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                        </path>
                                    </svg>
                                </button>
                                <button @click="borrarNoticia(noticia.id)"
                                    class="text-red-500 hover:text-red-700 p-2 bg-red-50 dark:bg-red-900/30 rounded-lg transition-colors"
                                    title="Eliminar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal de Formulario -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div
                    class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h2 class="text-lg font-bold text-gray-800 dark:text-white">
                        {{ isEditing ? 'Editar Noticia' : 'Nueva Noticia' }}
                    </h2>
                    <button @click="cerrarModal" class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="p-5 overflow-y-auto flex-1 space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                        <input v-model="form.titulo" type="text"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ej. Tercera Sesión Ordinaria">
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <textarea v-model="form.descripcion" rows="4"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Detalles de la noticia..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Fecha
                                (Etiqueta)</label>
                            <input v-model="form.fecha_etiqueta" type="date"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ej. 20 JULIO 2026">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoría
                                (Texto)</label>
                            <input v-model="form.categoria_texto" type="text"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ej. Aviso Institucional">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Color de la
                            Categoría</label>
                        <select v-model="form.categoria_color"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                            <option value="blue">Azul</option>
                            <option value="indigo">Índigo</option>
                            <option value="emerald">Esmeralda (Verde)</option>
                            <option value="amber">Ámbar (Naranja)</option>
                            <option value="red">Rojo</option>
                            <option value="purple">Morado</option>
                        </select>
                    </div>

                    <!-- CAMPO DE PRIORIDAD ACTUALIZADO -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                        <select v-model.number="form.prioridad"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                            <option :value="1">Alta (Primera posición)</option>
                            <option :value="2">Media (Segunda posición)</option>
                            <option :value="3">Normal (Tercera posición)</option>
                        </select>
                    </div>
                </div>

                <div
                    class="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button @click="cerrarModal"
                        class="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
                    <button @click="guardar" :disabled="procesando"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50">
                        {{ procesando ? 'Guardando...' : 'Guardar Noticia' }}
                    </button>
                </div>
            </div>
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