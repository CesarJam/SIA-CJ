<template>
    <div :class="['fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6', modelValue ? 'pointer-events-auto' : 'pointer-events-none']"
        tabindex="0"
        ref="detallesContenedor"
        @keydown.esc.stop.prevent="cerrarModal">
        
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cerrarModal"></div>
        </transition>

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="modelValue" class="relative bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 h-[85vh]">
                
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center shrink-0">
                    <div class="flex items-center gap-3">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                            Expediente: {{ expediente?.numero_consecutivo }}
                        </h2>
                        <span class="px-2.5 py-1 text-xs font-bold rounded-full" :class="badgeColor(expediente?.estatus)">
                            {{ expediente?.estatus }}
                        </span>
                    </div>
                    <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-1.5 rounded-full">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div v-if="expediente?.estatus === 'Cancelado'" class="px-6 py-4 bg-red-50 border-b border-red-100 dark:bg-red-900/20 dark:border-red-800/30 flex items-start gap-3 shrink-0">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <h4 class="text-sm font-bold text-red-800 dark:text-red-300">Motivo de Cancelación</h4>
                        <p class="text-sm text-red-600 dark:text-red-400 mt-1 font-medium">
                            {{ expediente?.observaciones || 'No se especificó motivo en el sistema.' }}
                        </p>
                    </div>
                </div>

                <div class="p-6 overflow-y-auto flex-1 space-y-6">
                    
                    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 class="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Información General
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                            <div class="md:col-span-2">
                                <span class="block text-[11px] font-bold text-gray-500 uppercase">Asunto</span>
                                <p class="text-sm text-gray-800 dark:text-gray-200">{{ expediente?.asunto }}</p>
                            </div>
                            <div>
                                <span class="block text-[11px] font-bold text-gray-500 uppercase">Origen</span>
                                <p class="text-sm text-gray-800 dark:text-gray-200">
                                    {{ expediente?.area_origen?.codigo }} - {{ expediente?.area_origen?.seccion }}
                                </p>
                            </div>
                            
                            <div>
                                <span class="block text-[11px] font-bold text-gray-500 uppercase">Carácter / Prioridad</span>
                                <div class="mt-1">
                                    <span :class="badgePrioridad(expediente?.caracter)">
                                        {{ expediente?.caracter || 'Ordinario' }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span class="block text-[11px] font-bold text-gray-500 uppercase">Número de Fojas</span>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {{ expediente?.fojas || 'No especificado' }}
                                </p>
                            </div>
                            <div>
                                <span class="block text-[11px] font-bold text-gray-500 uppercase">Responsable Actual</span>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {{ expediente?.responsable_tramite || "Sin asignar" }}
                                </p>
                            </div>
                            <div class="md:col-span-3">
                                <span class="block text-[11px] font-bold text-gray-500 uppercase">Indicaciones</span>
                                <p class="text-sm text-gray-800 dark:text-gray-200 italic bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-700/50">
                                    {{ expediente?.indicaciones_tramite || "Ninguna indicación registrada." }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 class="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            Datos de Archivo (CADIDO)
                        </h3>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <span class="block text-[10px] font-bold text-gray-500 uppercase">Tradición</span>
                                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ obtenerValorArreglo(expediente?.tradicion) }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-gray-500 uppercase">Soporte</span>
                                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ obtenerValorArreglo(expediente?.soporte) }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-gray-500 uppercase">Acceso</span>
                                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ obtenerValorArreglo(expediente?.condicion_acceso) }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-gray-500 uppercase">Inmueble / Gaveta</span>
                                <span class="text-xs text-gray-800 dark:text-gray-200">{{ expediente?.inmueble || "No definido" }}</span>
                            </div>
                        </div>

                        <div v-if="expediente?.snapshot_cadido" class="bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div class="md:col-span-2">
                                    <span class="block text-[10px] font-bold text-emerald-600 uppercase">Subserie</span>
                                    <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
                                        {{ expediente.snapshot_cadido.codigo_subserie }} - {{ expediente.snapshot_cadido.nombre_subserie }}
                                    </span>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-emerald-600 uppercase">Valor Documental</span>
                                    <span class="text-sm text-gray-800 dark:text-gray-200">{{ expediente.snapshot_cadido.valor_documental }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-emerald-600 uppercase">Años Trámite</span>
                                    <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ expediente.snapshot_cadido.anios_tramite }}</span>
                                </div>
                                <div class="md:col-span-2">
                                    <span class="block text-[10px] font-bold text-emerald-600 uppercase">Años Concentración</span>
                                    <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ expediente.snapshot_cadido.anios_concentracion }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-2 text-xs text-gray-400 italic">
                            Clasificación intelectual pendiente (Se definirá al concluir).
                        </div>

                        <div class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 class="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                Documentos Digitales Anexos
                            </h4>
                            
                            <GestorDocumental 
                                v-if="expediente" 
                                :expedienteId="expediente.id" 
                                :folio="expediente.numero_consecutivo" 
                                modo="lectura"
                            />
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Trazabilidad (Línea de Tiempo)
                        </h3>

                        <div v-if="loadingBitacora" class="flex justify-center py-6 text-indigo-500">
                            <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                        <div v-else-if="historialBitacora.length === 0" class="text-center py-4 text-xs text-gray-400">
                            No se encontraron registros en la bitácora para este expediente.
                        </div>
                        <div v-else class="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6 pb-2">
                            <div v-for="(mov, idx) in historialBitacora" :key="idx" class="relative pl-6">
                                <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-indigo-500 shadow-sm"></div>

                                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {{ mov.accion || "Actualización de Estatus" }}
                                        </h4>
                                        <span v-if="mov.usuario" class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            {{ mov.usuario.nombre || 'Desconocido' }} / {{ mov.usuario.email || 'Desconocido' }}
                                        </span>
                                    </div>
                                    <time class="text-[11px] font-bold text-gray-400 whitespace-nowrap">
                                        {{ formatFechaHora(mov.fecha_hora) }}
                                    </time>
                                </div>

                                <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                    <span class="font-semibold text-gray-700 dark:text-gray-300">Estatus:</span>
                                    <span :class="badgeColor(mov.detalles?.estatus_nuevo || mov.detalles?.estatus_inicial || 'Recepcionado')" class="px-1.5 py-0.5 rounded ml-1 border">
                                        {{ mov.detalles?.estatus_nuevo || mov.detalles?.estatus_inicial || "Recepcionado" }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'
import GestorDocumental from '@/components/GestorDocumental.vue'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    expediente: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const historialBitacora = ref([])
const loadingBitacora = ref(false)

// Cargar bitácora cuando se abre el modal
watch(() => props.modelValue, async (isOpen) => {
    if (isOpen && props.expediente) {
        await cargarBitacora(props.expediente.id)
    } else {
        historialBitacora.value = [] // Limpiar al cerrar
    }
})

const cargarBitacora = async (idExpediente) => {
    loadingBitacora.value = true
    try {
        const { data, error } = await supabase
            .from("bitacora_movimientos")
            .select(`*, usuario:id_usuario (nombre, email)`)
            .eq("id_expediente", idExpediente)
            .order("fecha_hora", { ascending: false })

        if (error) throw error
        historialBitacora.value = data || []
    } catch (error) {
        console.error("Error al cargar bitácora:", error)
    } finally {
        loadingBitacora.value = false
    }
}

const cerrarModal = async () => {
    await nextTick()
    emit('update:modelValue', false)
}

// === UTILIDADES VISUALES REUTILIZADAS ===
const obtenerValorArreglo = (valor) => {
    if (!valor) return ""
    if (Array.isArray(valor)) return valor[0]
    if (typeof valor === "string") return valor.replace(/[[\]"{}]/g, "").trim()
    return valor
}

const formatFechaHora = (isoString) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleString("es-MX", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

const badgeColor = (estatus) => {
    switch (estatus) {
        case "Recepcionado": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
        case "En trámite": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
        case "Concluido": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
        case "Cancelado": return "bg-red-50 text-red-600/70 border border-red-200/60 dark:bg-red-900/20 dark:text-red-400/70 dark:border-red-800/50"
        default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
}

// Agrega esta función debajo de badgeColor
const badgePrioridad = (prioridad) => {
    const p = (prioridad || '').toLowerCase()
    
    if (p.includes('urgente') || p.includes('alta')) {
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-2 py-0.5 rounded text-xs font-bold border border-red-200 dark:border-red-800/50"
    }
    if (p.includes('extra') || p.includes('inmediata')) {
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-0.5 rounded text-xs font-bold border border-purple-200 dark:border-purple-800/50"
    }
    // Ordinario / Normal / Baja
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-bold border border-gray-200 dark:border-gray-700"
}

// Añade la referencia al contenedor
const detallesContenedor = ref(null)

// Modifica el watch existente de modelValue
watch(() => props.modelValue, async (isOpen) => {
    if (isOpen && props.expediente) {
        await cargarBitacora(props.expediente.id)
        // Agrega esto para el foco
        await nextTick()
        if (detallesContenedor.value) {
            detallesContenedor.value.focus()
        }
    } else {
        historialBitacora.value = []
    }
})


</script>