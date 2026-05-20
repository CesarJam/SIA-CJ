<template>
    <div :class="['fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6', modelValue ? 'pointer-events-auto' : 'pointer-events-none']">
        
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cerrarModal"></div>
        </transition>

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="modelValue" class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-emerald-200 dark:border-emerald-900/50">
                
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                        Clasificación Archivística Final componente
                    </h2>
                    <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto space-y-5 max-h-[70vh]">
                    <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-800 dark:text-emerald-300 mb-4 flex gap-3 items-center">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p>
                            El trámite de
                            <strong>{{ expediente?.numero_consecutivo }}</strong>
                            ha finalizado. Clasifica el fondo del asunto para cerrarlo y generar su Snapshot histórico.
                        </p>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Subserie Documental <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <select v-model="codigoSubserieLocal" required class="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 appearance-none">
                                <option value="" disabled>Selecciona la clasificación intelectual...</option>
                                <optgroup v-for="serie in catalogoSeries" :key="serie.id" :label="`${serie.codigo_serie} - ${serie.nombre}`" class="font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 text-xs">
                                    <option v-for="sub in serie.subseries" :key="sub.codigoSubserie" :value="sub.codigoSubserie" class="font-normal text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 text-sm pl-4">
                                        {{ sub.codigoSubserie }} - {{ sub.nombre }}
                                    </option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    <div v-if="detalleSeleccionado" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <h4 class="text-xs font-bold text-gray-400 uppercase mb-3">Previsualización del Snapshot Histórico</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Cód. Padre</label>
                                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ detalleSeleccionado.codigo_serie_padre }}</div>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Nombre Subserie</label>
                                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{{ detalleSeleccionado.nombre }}</div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Valor</label>
                                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ detalleSeleccionado.valor_documental }}</div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Años Trámite</label>
                                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ detalleSeleccionado.at }}</div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Años Concentración</label>
                                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ detalleSeleccionado.ac }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                    <button @click="cerrarModal" :disabled="procesando" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button @click="ejecutarConclusion" :disabled="procesando || !codigoSubserieLocal" class="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg font-bold shadow-md hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                        <span v-if="procesando" class="animate-pulse">Archivando...</span>
                        <span v-else>Confirmar y Archivar</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    expediente: { type: Object, default: null },
    catalogoSeries: { type: Array, required: true }, // Se lo pasamos desde Inventario para no hacer queries extra
    usuarioActual: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'guardado'])
const toast = useToast()

const procesando = ref(false)
const codigoSubserieLocal = ref('')

// Observar cuando cambia el expediente para precargar datos
watch(() => props.expediente, (nuevoExpediente) => {
    if (nuevoExpediente) {
        codigoSubserieLocal.value = nuevoExpediente.codigo_subserie || ""
    }
}, { immediate: true })

// Computado para obtener el detalle de la subserie seleccionada
const detalleSeleccionado = computed(() => {
    if (!codigoSubserieLocal.value) return null
    for (const serie of props.catalogoSeries) {
        const subFound = serie.subseries.find(s => s.codigoSubserie === codigoSubserieLocal.value)
        if (subFound) return subFound
    }
    return null
})

const cerrarModal = async () => {
    if (!procesando.value) {
        await nextTick()
        emit('update:modelValue', false)
    }
}

const ejecutarConclusion = async () => {
    if (!codigoSubserieLocal.value || !detalleSeleccionado.value) {
        return toast.error("Debes seleccionar una subserie para archivar.")
    }

    procesando.value = true
    try {
        // CONSTRUCCIÓN DEL SNAPSHOT HISTÓRICO JSONB
        const snapshotCadido = {
            codigo_padre: detalleSeleccionado.value.codigo_serie_padre,
            nombre_padre: detalleSeleccionado.value.nombre_serie_padre,
            codigo_subserie: detalleSeleccionado.value.codigoSubserie,
            nombre_subserie: detalleSeleccionado.value.nombre,
            valor_documental: detalleSeleccionado.value.valor_documental,
            anios_tramite: detalleSeleccionado.value.at,
            anios_concentracion: detalleSeleccionado.value.ac,
            fecha_clasificacion: new Date().toISOString(),
        }

        const payload = {
            estatus: "Concluido",
            codigo_subserie: codigoSubserieLocal.value,
            id_serie: detalleSeleccionado.value.id_serie_padre,
            id_usuario_actualizacion: props.usuarioActual,
            snapshot_cadido: snapshotCadido
        }

        const { error } = await supabase
            .from("expedientes")
            .update(payload)
            .eq("id", props.expediente.id)
            
        if (error) throw error

        toast.success(`Expediente clasificado y archivado.`)
        emit('guardado')
        
        // La corrección clave aquí:
        procesando.value = false
        cerrarModal()
        return
        
    } catch (err) {
        toast.error("Error al concluir el expediente.")
        procesando.value = false
    }
}
</script>