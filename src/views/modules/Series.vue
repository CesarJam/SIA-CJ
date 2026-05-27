<template>
    <div class="fade-in relative min-h-screen pb-10">
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Series Documentales</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestión de series y subseries por sección
                    autorizada.</p>
            </div>
            <select v-model="filtroSeccion"
                class="w-full md:w-64 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200">
                <option v-for="sec in seccionesDisponibles" :key="sec.id" :value="sec.id">
                    {{ sec.codigo }} - {{ sec.seccion }}
                </option>
            </select>
            <div class="flex items-center gap-3 w-full md:w-auto">
                <button @click="exportarCSV"
                    class="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    Exportar
                </button>
                <button @click="abrirModalNuevo"
                    class="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                    + Registrar Serie
                </button>
            </div>

        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/5">Código Serie</div>
                <div class="w-1/5">Nombre</div>
                <div class="w-1/5">Sección</div>
                <div class="w-1/5">Subseries</div>
                <div class="w-1/5 text-center">Acciones</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-for="item in seriesFiltradas" :key="item.id"
                    class="flex flex-col transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20">

                    <div class="p-4 md:px-6 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div class="w-full md:w-1/5 flex items-center justify-between md:justify-start">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Código:</span>
                            <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.codigo_serie }}</span>
                        </div>

                        <div class="w-full md:w-1/5 flex flex-col md:block mt-1 md:mt-0">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Nombre:</span>
                            <span class="text-sm text-gray-800 dark:text-gray-200">{{ item.nombre }}</span>
                        </div>

                        <div class="w-full md:w-1/5 flex items-center justify-between md:justify-start">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Sección:</span>
                            <span class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{{
                                item.cuadro_general?.codigo }} - {{ item.cuadro_general?.seccion }}</span>
                        </div>

                        <div class="w-full md:w-1/5 flex items-center justify-between md:justify-start mt-1 md:mt-0">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Subseries:</span>

                            <button @click="toggleExpandir(item.id)"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                                :class="{ 'ring-2 ring-indigo-500/50': filasExpandidas.includes(item.id) }">
                                <span class="text-xs font-bold">{{ item.subseries?.length || 0 }} elementos</span>
                                <svg class="w-4 h-4 transition-transform duration-300"
                                    :class="{ 'rotate-180 text-indigo-600 dark:text-indigo-400': filasExpandidas.includes(item.id) }"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>

                        <div
                            class="w-full md:w-1/5 flex items-center justify-end md:justify-center gap-4 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
                            <button @click="abrirModalEdicion(item)"
                                class="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                    </path>
                                </svg>
                            </button>
                            <button @click="eliminarSerie(item)"
                                class="flex items-center gap-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div v-show="filasExpandidas.includes(item.id)" class="px-4 pb-4 md:px-6 md:pb-4 w-full">
                        <div
                            class="bg-gray-50/80 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-inner">
                            <h4 class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Detalle de
                                Subseries</h4>

                            <ul v-if="item.subseries && item.subseries.length > 0" class="flex flex-col gap-2">
                                <li v-for="(sub, index) in item.subseries" :key="index"
                                    class="flex items-start md:items-center gap-4 px-3 py-5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all">
                                    <span
                                        class="text-indigo-600 dark:text-indigo-400 font-black w-16 md:w-35 shrink-0 break-words">
                                        {{ sub.codigoSubserie }}
                                    </span>
                                    <span class="font-medium flex-1 break-words">
                                        {{ sub.nombre }}
                                    </span>
                                </li>
                            </ul>

                            <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                                Esta serie no tiene subseries registradas.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <div v-if="loading" class="text-center py-12 text-gray-500 flex flex-col items-center">
                <svg class="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Cargando series documentales...
            </div>
            <div v-else-if="seriesFiltradas.length === 0" class="text-center py-12 text-gray-500">
                No hay series registradas en la sección seleccionada.
            </div>
        </div>

        <div
            :class="['fixed inset-0 z-50 flex items-center justify-center p-4', modalAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalAbierto" class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarModal">
                </div>
            </transition>
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modalAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-gray-800 dark:text-white">{{ editandoId ? 'Editar Serie' :
                            'Nueva Serie' }}</h2>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg></button>
                    </div>

                    <div class="p-6 overflow-y-auto space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Sección
                                    Responsable</label>
                                <select v-model="form.id_seccion"
                                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    <option v-for="sec in seccionesDisponibles" :key="sec.id" :value="sec.id">{{
                                        sec.codigo }} - {{ sec.seccion }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Código de
                                    Serie</label>
                                <input v-model="form.codigo_serie" type="text" placeholder="Ej: 1S.1"
                                    class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre de la
                                Serie</label>
                            <input v-model="form.nombre" type="text" placeholder="Ej: Correspondencia"
                                class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div class="flex justify-between items-center mb-4">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Subseries (1 a
                                    N)</label>
                                <button @click="agregarSubserie"
                                    class="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold hover:bg-indigo-100 transition-colors">+
                                    Añadir</button>
                            </div>
                            <div class="space-y-3">
                                <div v-for="(sub, index) in form.subseries" :key="index"
                                    class="flex gap-2 items-start bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                    <div class="w-1/3">
                                        <input v-model="sub.codigoSubserie" type="text" placeholder="ID/Código" readonly
                                            class="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white">
                                    </div>
                                    <div class="flex-1">
                                        <input ref="inputsNombres" v-model="sub.nombre" type="text"
                                            placeholder="Nombre Subserie" @keydown.enter.prevent="agregarSubserie"
                                            class="w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white">
                                    </div>
                                    <button @click="removerSubserie(index)"
                                        class="text-red-400 hover:text-red-600 p-1.5"><svg class="w-4 h-4" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                            </path>
                                        </svg></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModal"
                            class="flex-1 py-2.5 text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg">Cancelar</button>
                        <button @click="guardarSerie"
                            class="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transform active:scale-95 transition-all">Guardar</button>
                    </div>
                </div>
            </transition>
        </div>

        <ConfirmModal :isOpen="modalEliminar.abierto" title="Eliminar Serie"
            :message="`¿Borrar la serie '${modalEliminar.nombre}'?`" @confirm="confirmarEliminacion"
            @cancel="modalEliminar.abierto = false" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, defineAsyncComponent } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const ConfirmModal = defineAsyncComponent(() => import('@/components/ConfirmModal.vue'))

const toast = useToast()
const loading = ref(true)
const listaSeries = ref([])
const seccionesDisponibles = ref([])
const modalAbierto = ref(false)
const editandoId = ref(null)
const filtroSeccion = ref('')
const inputsNombres = ref([])
const filasExpandidas = ref([])

const form = ref({
    id_seccion: '',
    codigo_serie: '',
    nombre: '',
    subseries: []
})

const modalEliminar = ref({ abierto: false, id: null, nombre: '' })

const toggleExpandir = (id) => {
    const index = filasExpandidas.value.indexOf(id)
    if (index > -1) {
        // Si ya está abierta, la cerramos
        filasExpandidas.value.splice(index, 1)
    } else {
        // Si está cerrada, la abrimos
        filasExpandidas.value.push(id)
    }
}

//Lógica que filtra la lista original dependiendo del selector
const seriesFiltradas = computed(() => {
    return listaSeries.value.filter(serie => serie.id_seccion === filtroSeccion.value)
})

// === LÓGICA DE DATOS ===
const cargarInformacion = async () => {
    loading.value = true 
    
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: userData } = await supabase.from('usuarios').select('secciones_permitidas, rol').eq('email', user.email).single()

        let querySec = supabase.from('cuadro_general').select('id, codigo, seccion').order('codigo')
        if (userData.rol !== 'admin') {
            querySec = querySec.in('codigo', userData.secciones_permitidas)
        }
        const { data: secciones } = await querySec
        
        // Asignamos las secciones
        seccionesDisponibles.value = secciones || []

        // Seleccionar la primera coincidencia automáticamente si el filtro está vacío
        if (seccionesDisponibles.value.length > 0 && !filtroSeccion.value) {
            filtroSeccion.value = seccionesDisponibles.value[0].id
        }

        const { data: series } = await supabase.from('series').select('*, cuadro_general(codigo, seccion)').order('codigo_serie')
        listaSeries.value = series || []
        
    } catch (error) {
        console.error("Error al cargar Series:", error)
        toast.error("Error al cargar el catálogo de series.")
    } finally {
        loading.value = false 
    }
}

// === ACCIONES ===
const abrirModalNuevo = () => {
    editandoId.value = null
    form.value = { id_seccion: filtroSeccion.value, codigo_serie: '', nombre: '', subseries: [] }
    modalAbierto.value = true
}

const abrirModalEdicion = (item) => {
    editandoId.value = item.id
    form.value = { ...item }
    modalAbierto.value = true
}

const cerrarModal = () => { modalAbierto.value = false }

//Función para mantener la secuencia perfecta
const actualizarCodigosSubseries = () => {
    // Si aún no escriben el código principal, usamos 'SERIE' como prefijo visual temporal
    const prefijoBase = form.value.codigo_serie ? form.value.codigo_serie.trim() : 'SERIE'

    form.value.subseries.forEach((sub, index) => {
        sub.codigoSubserie = `${prefijoBase}.${index + 1}`
    })
}

const agregarSubserie = async () => {
    const prefijoBase = form.value.codigo_serie ? form.value.codigo_serie.trim() : 'SERIE'
    const siguienteNumero = form.value.subseries.length + 1

    form.value.subseries.push({
        codigoSubserie: `${prefijoBase}.${siguienteNumero}`,
        nombre: ''
    })

    // TRUCO PRO UX: Esperar a que el DOM se actualice y enfocar el nuevo campo
    await nextTick()
    if (inputsNombres.value && inputsNombres.value.length > 0) {
        // Filtramos posibles elementos nulos (que quedan a veces al borrar filas)
        const inputsActivos = inputsNombres.value.filter(el => el !== null)
        if (inputsActivos.length > 0) {
            inputsActivos[inputsActivos.length - 1].focus()
        }
    }
}

const removerSubserie = (index) => {
    form.value.subseries.splice(index, 1)
    actualizarCodigosSubseries()
}

// Observa cambios en el código principal
watch(() => form.value.codigo_serie, (nuevoCodigo) => {
    // Solo actualiza si ya hay subseries en la lista
    if (form.value.subseries.length > 0) {
        actualizarCodigosSubseries()
    }
})

const guardarSerie = async () => {
    if (!form.value.codigo_serie || !form.value.id_seccion) return toast.error('Faltan campos obligatorios')

    const payload = {
        codigo_serie: form.value.codigo_serie.trim(),
        nombre: form.value.nombre.trim(),
        id_seccion: form.value.id_seccion,
        subseries: form.value.subseries
    }

    const { error } = editandoId.value
        ? await supabase.from('series').update(payload).eq('id', editandoId.value)
        : await supabase.from('series').insert([payload])

    if (error) return toast.error(error.message)

    toast.success(editandoId.value ? 'Serie actualizada' : 'Serie registrada')
    cargarInformacion()
    cerrarModal()
}

const eliminarSerie = (item) => {
    modalEliminar.value = { abierto: true, id: item.id, nombre: item.nombre }
}

const confirmarEliminacion = async () => {
    await supabase.from('series').delete().eq('id', modalEliminar.value.id)
    toast.success('Serie eliminada')
    cargarInformacion()
    modalEliminar.value.abierto = false
}

const exportarCSV = () => {
    let csv = "\uFEFFCódigo;Nombre;Sección;Subseries\n"
    seriesFiltradas.value.forEach(s => {
        const subNombres = s.subseries.map(sub => sub.nombre).join(' | ')
        csv += `"${s.codigo_serie}";"${s.nombre}";"${s.cuadro_general.codigo}";"${subNombres}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "SeriesDocumentales.csv"
    link.click()
}

const handleKeydown = (e) => {
    if (e.key === 'Escape' && modalAbierto.value && !modalEliminar.value.abierto) cerrarModal()
}

onMounted(() => {
    cargarInformacion()
    document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>