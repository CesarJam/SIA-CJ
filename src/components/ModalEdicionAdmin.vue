<template>
    <div
        :class="['fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6', modelValue ? 'pointer-events-auto' : 'pointer-events-none']">

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="cerrarModal"></div>
        </transition>

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="modelValue"
                class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border-2 border-red-400 dark:border-red-900/50 h-[90vh]">

                <div
                    class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20 flex justify-between items-center shrink-0">
                    <div class="flex items-center gap-3">
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <h2 class="text-lg font-bold text-red-800 dark:text-red-400">
                            Corrección Administrativa (Modo SUPER ADMIN)
                        </h2>
                    </div>
                    <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto flex-1 space-y-6">
                    <div
                        class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3
                            class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            1. Datos Generales del Documento</h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">No.
                                    Consecutivo</label>
                                <input v-model="form.numero_consecutivo" type="text"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Fecha de
                                    Registro</label>
                                <input v-model="form.fecha_registro" type="date"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md dark:[color-scheme:dark]">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Fojas</label>
                                <input v-model.number="form.fojas" type="number"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Carácter</label>
                                <select v-model="form.caracter"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="Ordinario">Ordinario</option>
                                    <option value="Urgente">Urgente</option>
                                    <option value="Extraordinario">Extraordinario</option>
                                </select>
                            </div>
                            <div class="md:col-span-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asunto</label>
                                <textarea v-model="form.asunto" rows="2"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"></textarea>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <h3
                            class="text-sm font-bold text-blue-800 dark:text-blue-300 mb-4 border-b border-blue-200 dark:border-blue-800/50 pb-2">
                            2. Atención y Ubicación Física</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label
                                    class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Responsable</label>
                                <input v-model="form.responsable_tramite" type="text"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                            </div>
                            <div class="md:col-span-2">
                                <label
                                    class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Indicaciones</label>
                                <input v-model="form.indicaciones_tramite" type="text"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tradición</label>
                                <select v-model="form.tradicion"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="Original">Original</option>
                                    <option value="Copia">Copia</option>
                                    <option value="Electrónico">Electrónico</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Soporte</label>
                                <select v-model="form.soporte"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="Papel">Papel</option>
                                    <option value="Óptico">Óptico (CD/DVD)</option>
                                    <option value="Digital">Digital / Nube</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Condición de
                                    Acceso</label>
                                <select v-model="form.condicion_acceso"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="Pública">Pública</option>
                                    <option value="Reservada">Reservada</option>
                                    <option value="Confidencial">Confidencial</option>
                                </select>
                            </div>
                            <div class="md:col-span-3">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Inmueble /
                                    Gaveta</label>
                                <input v-model="form.inmueble" type="text"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-emerald-50/30 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div
                            class="flex justify-between items-center mb-4 border-b border-emerald-200 dark:border-emerald-800/50 pb-2">
                            <h3 class="text-sm font-bold text-emerald-800 dark:text-emerald-300">3. Clasificación CADIDO
                                (Snapshot)</h3>
                            <button @click="modificandoCadido = !modificandoCadido"
                                class="text-xs font-bold px-3 py-1 rounded-md transition-colors"
                                :class="modificandoCadido ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'">
                                {{ modificandoCadido ? 'Cancelar reclasificación' : 'Reclasificar Expediente' }}
                            </button>
                        </div>

                        <div v-if="!modificandoCadido" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="md:col-span-2">
                                <span class="block text-[10px] font-bold text-emerald-600 uppercase">Subserie
                                    Actual</span>
                                <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{
                                    expediente?.snapshot_cadido?.codigo_subserie }} - {{
                                        expediente?.snapshot_cadido?.nombre_subserie }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-emerald-600 uppercase">Valor
                                    Documental</span>
                                <span class="text-sm text-gray-800 dark:text-gray-200">{{
                                    expediente?.snapshot_cadido?.valor_documental }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-emerald-600 uppercase">Vigencia
                                    (AT/AC)</span>
                                <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{
                                    expediente?.snapshot_cadido?.anios_tramite }} / {{
                                        expediente?.snapshot_cadido?.anios_concentracion }}</span>
                            </div>
                        </div>

                        <div v-else class="relative">
                            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Buscar Nueva
                                Subserie</label>
                            <input type="text" v-model="terminoBusqueda"
                                placeholder="Escribe el nombre o código para cambiar..."
                                class="w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-600 rounded-md focus:ring-2 focus:ring-emerald-500"
                                @focus="busquedaActiva = true" @blur="setTimeout(() => busquedaActiva = false, 200)" />

                            <div v-if="busquedaActiva && terminoBusqueda"
                                class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                                <template v-for="serie in seriesFiltradas" :key="serie.id">
                                    <div
                                        class="px-3 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-500 uppercase sticky top-0 z-10 shadow-sm">
                                        {{ serie.codigo_serie }} - {{ serie.nombre }}</div>
                                    <button v-for="sub in serie.subseries" :key="sub.codigoSubserie"
                                        @click="seleccionarSubserie(sub)"
                                        class="w-full text-left px-4 py-3 text-base hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border-b border-gray-50 dark:border-gray-700/50 transition-colors">
                                        {{ sub.codigoSubserie }} - {{ sub.nombre }}
                                    </button>
                                </template>
                            </div>

                            <div v-if="detalleSeleccionado"
                                class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                                <strong>Nueva Selección:</strong> Se actualizará a "{{
                                detalleSeleccionado.codigoSubserie }} - {{
                                detalleSeleccionado.nombre }}".
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40 shrink-0">
                    <button @click="cerrarModal" :disabled="procesando"
                        class="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button @click="ejecutarCorreccion" :disabled="procesando"
                        class="px-6 py-2.5 text-sm bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                        <span v-if="procesando" class="animate-pulse">Aplicando Cambios...</span>
                        <span v-else>Forzar Actualización</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    expediente: { type: Object, default: null },
    catalogoSeries: { type: Array, required: true },
    usuarioActual: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'guardado'])
const toast = useToast()
const procesando = ref(false)

const form = ref({})
const modificandoCadido = ref(false)
const terminoBusqueda = ref('')
const busquedaActiva = ref(false)
const codigoSubserieLocal = ref('')

// Limpieza de arreglos de PostgreSQL
const obtenerValorArreglo = (valor) => {
    if (!valor) return ''
    if (Array.isArray(valor)) return valor[0]
    if (typeof valor === 'string') return valor.replace(/[[\]"{}]/g, '').trim()
    return valor
}

watch(() => props.modelValue, (isOpen) => {
    if (isOpen && props.expediente) {
        modificandoCadido.value = false
        terminoBusqueda.value = ''
        codigoSubserieLocal.value = props.expediente.codigo_subserie || ''

        form.value = {
            numero_consecutivo: props.expediente.numero_consecutivo,
            fecha_registro: props.expediente.fecha_registro,
            fojas: props.expediente.fojas,
            caracter: props.expediente.caracter,
            asunto: props.expediente.asunto,
            responsable_tramite: props.expediente.responsable_tramite || '',
            indicaciones_tramite: props.expediente.indicaciones_tramite || '',
            tradicion: obtenerValorArreglo(props.expediente.tradicion) || 'Original',
            soporte: obtenerValorArreglo(props.expediente.soporte) || 'Papel',
            condicion_acceso: obtenerValorArreglo(props.expediente.condicion_acceso) || 'Pública',
            inmueble: props.expediente.inmueble || ''
        }
    }
})

// === LÓGICA DE BÚSQUEDA CADIDO ===
const seriesFiltradas = computed(() => {
    const term = terminoBusqueda.value.toLowerCase()
    return props.catalogoSeries
        .map(serie => ({
            ...serie,
            subseries: serie.subseries.filter(sub => sub.nombre.toLowerCase().includes(term) || sub.codigoSubserie.toLowerCase().includes(term))
        }))
        .filter(serie => serie.subseries.length > 0)
})

const seleccionarSubserie = (sub) => {
    codigoSubserieLocal.value = sub.codigoSubserie
    terminoBusqueda.value = `${sub.codigoSubserie} - ${sub.nombre}`
    busquedaActiva.value = false
}

const detalleSeleccionado = computed(() => {
    if (!modificandoCadido.value || !codigoSubserieLocal.value) return null
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

const ejecutarCorreccion = async () => {
    procesando.value = true
    try {
        let payload = {
            ...form.value,
            id_usuario_actualizacion: props.usuarioActual
        }

        // Si el admin activó la modificación del CADIDO y seleccionó uno nuevo
        if (modificandoCadido.value && detalleSeleccionado.value) {
            payload.codigo_subserie = codigoSubserieLocal.value
            payload.id_serie = detalleSeleccionado.value.id_serie_padre
            payload.snapshot_cadido = {
                codigo_padre: detalleSeleccionado.value.codigo_serie_padre,
                nombre_padre: detalleSeleccionado.value.nombre_serie_padre,
                codigo_subserie: detalleSeleccionado.value.codigoSubserie,
                nombre_subserie: detalleSeleccionado.value.nombre,
                valor_documental: detalleSeleccionado.value.valor_documental,
                anios_tramite: detalleSeleccionado.value.at,
                anios_concentracion: detalleSeleccionado.value.ac,
                fecha_clasificacion: new Date().toISOString(), // Actualizamos la fecha de reclasificación
            }
        }

        const { error } = await supabase.from("expedientes").update(payload).eq("id", props.expediente.id)
        if (error) throw error

        // Insertamos en la bitácora automáticamente que un admin modificó esto
        await supabase.from("bitacora_movimientos").insert([{
            id_expediente: props.expediente.id,
            id_usuario: props.usuarioActual,
            accion: "Corrección Administrativa",
            detalles: { mensaje: "Un administrador modificó los datos del expediente concluido." }
        }])

        toast.success(`Corrección administrativa aplicada.`)
        emit('guardado')
        procesando.value = false
        cerrarModal()

    } catch (err) {
        toast.error("Error al aplicar la corrección.")
        procesando.value = false
    }
}

const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.modelValue && !procesando.value) cerrarModal()
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>