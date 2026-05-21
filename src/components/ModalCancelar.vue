<template>
    <div :class="['fixed inset-0 z-[70] flex items-center justify-center p-4', modelValue ? 'pointer-events-auto' : 'pointer-events-none']">
        
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cerrarModal"></div>
        </transition>

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95 translate-y-4">
            <div v-if="modelValue" class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-red-200 dark:border-red-900/50">
                
                <div class="px-5 py-4 border-b border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 flex gap-3 items-center">
                    <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <h2 class="text-base font-bold text-red-800 dark:text-red-300">Cancelar Registro Local</h2>
                </div>
                
                <div class="p-5 space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        Estás a punto de cancelar el folio <strong class="text-gray-900 dark:text-white">{{ expediente?.numero_consecutivo }}</strong>.
                    </p>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Motivo de la cancelación <span class="text-red-500">*</span></label>
                        <textarea v-model="motivoCancelacion" rows="3" placeholder="Justificación obligatoria..." required class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-colors"></textarea>
                    </div>
                </div>
                
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                    <button @click="cerrarModal" :disabled="procesando" class="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">Abortar</button>
                    <button @click="ejecutarCancelacion" :disabled="procesando || !motivoCancelacion.trim()" class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50">
                        <span v-if="procesando" class="animate-pulse">Procesando...</span>
                        <span v-else>Confirmar Cancelación</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    expediente: { type: Object, default: null },
    usuarioActual: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'guardado'])
const toast = useToast()

const procesando = ref(false)
const motivoCancelacion = ref('')

// Limpiar el motivo cuando se abre el modal para un nuevo expediente
watch(() => props.modelValue, (isOpen) => {
    if (isOpen) motivoCancelacion.value = ''
})

const cerrarModal = async () => {
    if (!procesando.value) {
        await nextTick()
        emit('update:modelValue', false)
    }
}

const ejecutarCancelacion = async () => {
    motivoCancelacion.value = motivoCancelacion.value.trim()
    procesando.value = true

    try {
        const notaJustificacion = `[CANCELADO POR ÁREA LOCAL]: ${motivoCancelacion.value}`

        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Cancelado',
                observaciones: notaJustificacion,
                id_usuario_actualizacion: props.usuarioActual
            })
            .eq('id', props.expediente.id)

        if (error) throw error

        toast.success(`Folio ${props.expediente.numero_consecutivo} cancelado exitosamente.`)
        emit('guardado')
        
        procesando.value = false
        cerrarModal()
        return
        
    } catch (err) {
        toast.error(err.message || "Error al intentar cancelar el registro.")
        procesando.value = false
    }
}
</script>