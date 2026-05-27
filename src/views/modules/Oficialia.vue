<template>
    <div class="fade-in relative min-h-screen pb-10">

        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Oficialía de Partes</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Recepción, captura y turnado de
                    correspondencia.</p>
            </div>

            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select v-model="filtroAnio" @change="cargarDatos"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer font-bold">
                    <option v-for="anio in opcionesAnios" :key="anio" :value="anio">
                        Año {{ anio }}
                    </option>
                </select>

                <select v-model="filtroEstatus" @change="cargarDatos"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer">
                    <option value="Todos">Todos los estatus</option>
                    <option value="Recepcionado">Recepcionado</option>
                    <option value="En trámite">En trámite</option>
                    <option value="Concluido">Concluido</option>
                    <option value="Cancelado">Cancelados</option>
                </select>

                <button @click="abrirModalNuevo"
                    class="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                    + Nuevo Registro
                </button>
            </div>
        </div>

        <ModalRegistroDocumento v-model="modalRegistroAbierto" :origenId="idSeccionOficialia || ''"
            :datosEditar="expedienteAEditar" @guardado="cargarDatos" />

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/6">Folio / Fecha</div>
                <div class="w-1/3">Asunto</div>
                <div class="w-1/4">Área Turnada (Destino)</div>
                <div class="w-1/6 text-center">Estatus</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-for="item in listaExpedientes" :key="item.id"
                    class="p-4 md:px-6 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20">

                    <div class="w-full md:w-1/6 flex flex-col md:block">
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.numero_consecutivo
                        }}</span><br>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatFecha(item.fecha_registro)
                        }}</span>
                    </div>

                    <div class="w-full md:w-1/3 flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Asunto:</span>
                        <span class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2" :title="item.asunto">{{
                            item.asunto }}</span>
                    </div>

                    <div class="w-full md:w-1/4 flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Destino:</span>
                        <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {{ item.area_destino?.codigo }} - {{ item.area_destino?.seccion }}
                        </span>
                        <div class="mt-1.5">
                            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md"
                                :class="obtenerValorArreglo(item.tradicion) === 'Original' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                {{ obtenerValorArreglo(item.tradicion) }}
                            </span>
                        </div>


                    </div>


                    <div class="w-full md:w-1/6 flex justify-between items-center md:justify-center mt-2 md:mt-0 gap-3">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estatus:</span>
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-full" :class="badgeColor(item.estatus)">
                                {{ item.estatus }}
                            </span>

                            <div v-if="item.estatus === 'Recepcionado'"
                                class="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
                                <button @click="abrirModalEditar(item)" title="Editar registro"
                                    class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                        </path>
                                    </svg>
                                </button>

                                <button @click="abrirModalCancelar(item)" title="Cancelar registro"
                                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
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
                Cargando registros...
            </div>
            <div v-else-if="listaExpedientes.length === 0" class="text-center py-12 text-gray-500">
                Aún no hay registros capturados en Oficialía de Partes en este periodo.
            </div>
        </div>
        <div
            :class="['fixed inset-0 z-[70] flex items-center justify-center p-4', modalCancelarAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalCancelarAbierto" class="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    @click="cerrarModalCancelar"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95 translate-y-4"
                enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95 translate-y-4">
                <div v-if="modalCancelarAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-red-200 dark:border-red-900/50">

                    <div
                        class="px-5 py-4 border-b border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 flex gap-3 items-center">
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                            </path>
                        </svg>
                        <h2 class="text-base font-bold text-red-800 dark:text-red-300">Cancelar Registro</h2>
                    </div>

                    <div class="p-5 space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            Estás a punto de cancelar el folio <strong class="text-gray-900 dark:text-white">{{
                                folioACancelar }}</strong>.
                            Esta acción <span class="underline decoration-red-500 font-semibold">no eliminará</span> el
                            registro de la base de datos, pero lo retirará de las bandejas operativas.
                        </p>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Motivo de la
                                cancelación <span class="text-red-500">*</span></label>
                            <textarea v-model="motivoCancelacion" rows="3"
                                placeholder="Ej: Se capturó por duplicado, el folio correcto es..." required
                                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"></textarea>
                        </div>
                    </div>

                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalCancelar" :disabled="procesandoCancelacion"
                            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Abortar</button>
                        <button @click="ejecutarCancelacion"
                            :disabled="procesandoCancelacion || !motivoCancelacion.trim()"
                            class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                            <span v-if="procesandoCancelacion" class="animate-pulse">Procesando...</span>
                            <span v-else>Confirmar Cancelación</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

import ModalRegistroDocumento from '@/components/ModalRegistroDocumento.vue'

const toast = useToast()

// === ESTADOS GLOBALES ===
const loading = ref(true)
const listaExpedientes = ref([])
const idSeccionOficialia = ref(null)
const usuarioActual = ref(null)

// === FILTROS ===
const anioActual = new Date().getFullYear()
const opcionesAnios = ref(Array.from({ length: 8 }, (_, i) => anioActual - i))
const filtroAnio = ref(anioActual)
const filtroEstatus = ref("Todos")

// === ESTADOS MODAL REGISTRO ===
const modalRegistroAbierto = ref(false)
const expedienteAEditar = ref(null)

// === ESTADOS Y LÓGICA DE CANCELACIÓN (Soft Delete) ===
const modalCancelarAbierto = ref(false)
const procesandoCancelacion = ref(false)
const cancelarId = ref(null)
const folioACancelar = ref('')
const motivoCancelacion = ref('')


const dependenciasFiltradas = computed(() => {
    if (!busquedaDependencia.value) return catalogoDependencias.value
    const termino = busquedaDependencia.value.toLowerCase()
    return catalogoDependencias.value.filter(dep =>
        dep.nombre_oficial.toLowerCase().includes(termino) ||
        (dep.siglas && dep.siglas.toLowerCase().includes(termino))
    )
})

const dependenciasSeleccionadasInfo = computed(() => {
    return catalogoDependencias.value.filter(dep => form.value.dependencias_ids.includes(dep.id))
})

const removerDependencia = (id) => {
    form.value.dependencias_ids = form.value.dependencias_ids.filter(depId => depId !== id)
}

const formDependencia = ref({
    nombre_oficial: '',
    siglas: '',
    titular: '',
    tipo_ente: 'Estatal'
})

const abrirModalDependencia = () => {
    formDependencia.value = { nombre_oficial: '', siglas: '', titular: '', tipo_ente: 'Estatal' }
    modalDependenciaAbierto.value = true
}

const cerrarModalDependencia = () => {
    if (!procesandoDependencia.value) modalDependenciaAbierto.value = false
}


// === CARGA INICIAL Y FILTRADA ===
// === CARGA INICIAL Y FILTRADA ===
const cargarDatos = async () => {
    loading.value = true

    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: userData } = await supabase.from('usuarios').select('id, rol, secciones_permitidas').eq('email', user.email).single()
        usuarioActual.value = userData.id

        const codigoOficialia = 'OFP'

        if (userData.rol === 'admin' || (userData.secciones_permitidas && userData.secciones_permitidas.includes(codigoOficialia))) {
            const { data: sec } = await supabase.from('cuadro_general')
                .select('id')
                .eq('codigo', codigoOficialia)
                .single()

            idSeccionOficialia.value = sec?.id
        }

        if (idSeccionOficialia.value) {
            // CONSTRUCCIÓN DINÁMICA DE LA CONSULTA
            let query = supabase
                .from('expedientes')
                .select(`*, area_destino:id_seccion_turnada (codigo, seccion)`)
                .eq('id_seccion_registro', idSeccionOficialia.value)
                .gte("fecha_registro", `${filtroAnio.value}-01-01`)
                .lte("fecha_registro", `${filtroAnio.value}-12-31`)
                .order('fecha_registro', { ascending: false })
                .order('hora_registro', { ascending: false })

            // APLICAR FILTRO DE ESTATUS SI NO ES "Todos"
            if (filtroEstatus.value !== "Todos") {
                query = query.eq('estatus', filtroEstatus.value)
            }

            const { data: expedientes, error } = await query
            if (error) throw error
            listaExpedientes.value = expedientes || []
        }
    } catch (error) {
        console.error("Error al cargar datos de Oficialía:", error)
        toast.error("Error al cargar los registros.")
    } finally {
        loading.value = false
    }
}

// === GESTIÓN DEL MODAL ===

const abrirModalNuevo = () => {
    expedienteAEditar.value = null // Null significa "Modo Creación"
    modalRegistroAbierto.value = true
}

const abrirModalEditar = (item) => {
    expedienteAEditar.value = item // Le pasamos la fila completa para "Modo Edición"
    modalRegistroAbierto.value = true
}

// === LÓGICA DE CANCELACIÓN ===
const abrirModalCancelar = (item) => {
    cancelarId.value = item.id
    folioACancelar.value = item.numero_consecutivo
    motivoCancelacion.value = ''
    modalCancelarAbierto.value = true
}

const cerrarModalCancelar = () => {
    if (!procesandoCancelacion.value) modalCancelarAbierto.value = false
}

const ejecutarCancelacion = async () => {
    motivoCancelacion.value = motivoCancelacion.value.trim()
    procesandoCancelacion.value = true
    try {
        const notaJustificacion = `[CANCELADO DESDE OFICIALÍA]: ${motivoCancelacion.value}`

        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Cancelado',
                observaciones: notaJustificacion,
                id_usuario_actualizacion: usuarioActual.value
            })
            .eq('id', cancelarId.value)

        if (error) throw error

        toast.success(`Folio ${folioACancelar.value} cancelado exitosamente.`)
        await cargarDatos()
        modalCancelarAbierto.value = false

    } catch (err) {
        toast.error(err.message || "Error al intentar cancelar el registro.")
    } finally {
        procesandoCancelacion.value = false
    }
}

// === UTILIDADES VISUALES ===

// UTILIDAD PARA ARREGLOS DE BD (Soporte, Tradición, Condición)
const obtenerValorArreglo = (valor) => {
    if (!valor) return ''

    // Si es un arreglo nativo de JavaScript
    if (Array.isArray(valor)) return valor[0]

    // Si viene como string crudo desde la BD (ej. '["Original"]' o '{"Original"}')
    if (typeof valor === 'string') {
        // Limpieza con Expresión Regular: quita corchetes, llaves y comillas dobles
        return valor.replace(/[[\]"{}]/g, '').trim()
    }

    return valor
}

const formatFecha = (fechaISO) => {
    if (!fechaISO) return ''
    const [year, month, day] = fechaISO.split('-')
    return `${day}/${month}/${year}`
}

const badgeColor = (estatus) => {
    switch (estatus) {
        case 'Recepcionado': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
        case 'En trámite':
        case 'Trabajado': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
        case 'Concluido': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
        case 'Cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800'
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
}

// Event Listeners (Accesibilidad)
// === ACCESIBILIDAD (TECLADO) ===
const handleKeydown = (e) => {
    // Solo manejamos el modal local de cancelación (El de registro se maneja a sí mismo)
    if (e.key === 'Escape' && modalCancelarAbierto.value && !procesandoCancelacion.value) {
        cerrarModalCancelar()
    }
}


onMounted(() => {
    cargarDatos()
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>