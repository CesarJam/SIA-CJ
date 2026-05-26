<template>
    <div :class="['fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6', modelValue ? 'pointer-events-auto' : 'pointer-events-none']">
        
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cerrarModal"></div>
        </transition>

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="modelValue" class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-blue-200 dark:border-blue-900/50">
                
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-blue-800 dark:text-blue-400">
                        Asignar Trámite y Datos Físicos COMPONENTE
                    </h2>
                    <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto space-y-6 max-h-[70vh]">
                    
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                            1. Control de Tareas
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Responsable del Trámite <span class="text-red-500">*</span></label>
                                <input v-model="form.responsable_tramite" type="text" placeholder="Ej: Lic. Arturo Jiménez" required class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Indicaciones / Observaciones de la asignación</label>
                                <textarea v-model="form.indicaciones_tramite" rows="2" placeholder="Ej: Responder oficio antes del viernes. Se reasignó por carga de trabajo." class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                        <h3 class="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-3 border-b border-indigo-200 dark:border-indigo-800/50 pb-2">
                            2. Naturaleza Física (Pre-CADIDO)
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tradición Documental</label>
                                <select v-model="form.tradicion" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="Original">Original</option>
                                    <option value="Copia">Copia</option>
                                    <option value="Electrónico">Electrónico</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Soporte</label>
                                <select v-model="form.soporte" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="Papel">Papel</option>
                                    <option value="Óptico">Óptico (CD/DVD)</option>
                                    <option value="Digital">Digital / Nube</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Condición de Acceso</label>
                                <select v-model="form.condicion_acceso" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="Pública">Pública</option>
                                    <option value="Reservada">Reservada</option>
                                    <option value="Confidencial">Confidencial</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Inmueble (Gaveta)</label>
                                <input v-model="form.inmueble" type="text" placeholder="Ej: Archivo de Trámite" class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
                            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            3. Archivos Digitales (Anexos)
                        </h3>
                        <GestorDocumental 
                            v-if="expediente" 
                            :expedienteId="expediente.id" 
                            :folio="expediente.numero_consecutivo" 
                            modo="escritura"
                        />
                    </div>
                </div>

                <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                    <button @click="cerrarModal" :disabled="procesando" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button @click="ejecutarAtencion" :disabled="procesando || !form.responsable_tramite.trim()" class="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                        <span v-if="procesando" class="animate-pulse">Guardando...</span>
                        <span v-else>Guardar y Comenzar Trámite</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted} from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'
import GestorDocumental from '@/components/GestorDocumental.vue'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    expediente: { type: Object, default: null },
    usuarioActual: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'guardado'])
const toast = useToast()

const procesando = ref(false)
const form = ref({
    responsable_tramite: '',
    indicaciones_tramite: '',
    tradicion: 'Original',
    soporte: 'Papel',
    condicion_acceso: 'Pública',
    inmueble: ''
})

// Utilidad local para limpiar datos de arreglos provenientes de PostgreSQL
const obtenerValorArreglo = (valor) => {
    if (!valor) return ''
    if (Array.isArray(valor)) return valor[0]
    if (typeof valor === 'string') return valor.replace(/[[\]"{}]/g, '').trim()
    return valor
}

// Al abrir el modal (cuando cambia expediente), poblamos los datos
watch(() => props.expediente, (nuevoExpediente) => {
    if (nuevoExpediente) {
        form.value = {
            responsable_tramite: nuevoExpediente.responsable_tramite || "",
            indicaciones_tramite: nuevoExpediente.indicaciones_tramite || "",
            tradicion: obtenerValorArreglo(nuevoExpediente.tradicion) || "Original",
            soporte: obtenerValorArreglo(nuevoExpediente.soporte) || "Papel",
            condicion_acceso: obtenerValorArreglo(nuevoExpediente.condicion_acceso) || "Pública",
            inmueble: nuevoExpediente.inmueble || ""
        }
    }
}, { immediate: true })

const cerrarModal = async () => {
    if (!procesando.value) {
        emit('update:modelValue', false);
    }
}

const ejecutarAtencion = async () => {
    form.value.responsable_tramite = form.value.responsable_tramite.trim()

    if (!form.value.responsable_tramite) {
        return toast.error("El responsable es obligatorio.")
    }

    procesando.value = true

    try {
        const payload = {
            estatus: "En trámite",
            responsable_tramite: form.value.responsable_tramite,
            indicaciones_tramite: form.value.indicaciones_tramite.trim(),
            inmueble: form.value.inmueble,
            id_usuario_actualizacion: props.usuarioActual,
            soporte: form.value.soporte,
            tradicion: form.value.tradicion,
            condicion_acceso: form.value.condicion_acceso,
        }

        const { error } = await supabase
            .from("expedientes")
            .update(payload)
            .eq("id", props.expediente.id)

        if (error) throw error

        toast.success("Trámite asignado y actualizado correctamente.")

        emit('guardado')

        procesando.value = false
        cerrarModal()
        return

    } catch (error) {
        toast.error("Error al asignar el trámite.")
    } finally {
        procesando.value = false
    }
}
// === LÓGICA DE TECLADO (Cerrar con ESC) ===
const handleKeydown = (e) => {
    // Solo cierra si el modal está abierto y NO está procesando/guardando
    if (e.key === 'Escape' && props.modelValue && !procesando.value) {
        cerrarModal() 
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>