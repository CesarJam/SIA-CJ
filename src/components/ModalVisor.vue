<template>
    <div v-if="modelValue" class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            tabindex="0"
            ref="visorContenedor"
            @keydown.esc.stop.prevent="cerrarVisor">
        <div class="relative w-full h-full max-w-6xl flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            
            <div class="px-4 py-3 bg-gray-800 flex justify-between items-center text-white shrink-0 border-b border-gray-700">
                <div class="flex items-center gap-3 overflow-hidden">
                    <svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <h3 class="text-sm font-bold truncate pr-4 text-gray-200">{{ nombreArchivo }}</h3>
                </div>
                
                <div class="flex gap-3 shrink-0">
                    <a :href="urlArchivo" target="_blank" download class="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 border border-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Descargar
                    </a>
                    <button @click="$emit('update:modelValue', false)" class="text-gray-300 hover:text-white transition-colors bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-md text-xs font-bold border border-red-500/50">
                        Cerrar Visor
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-hidden flex items-center justify-center bg-gray-900/50">
                <img v-if="esImagen" :src="urlArchivo" class="max-w-full max-h-full object-contain p-2" />
                
                <iframe v-else-if="esPdf" :src="urlArchivo" class="w-full h-full border-0 bg-white"></iframe>
                
                <div v-else class="text-gray-400 text-center flex flex-col items-center p-6">
                    <div class="bg-gray-800 p-4 rounded-full mb-4">
                        <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <p class="text-lg font-bold text-gray-300">Vista previa no disponible</p>
                    <p class="text-sm mt-2 text-gray-500 max-w-sm">No podemos previsualizar este tipo de archivo directamente en el navegador. Por favor, utiliza el botón de descarga.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    urlArchivo: { type: String, default: '' },
    nombreArchivo: { type: String, default: 'Documento Anexo' },
    tipoArchivo: { type: String, default: '' } // Ejemplo: 'application/pdf', 'image/png'
})

const emit = defineEmits(['update:modelValue'])

const visorContenedor = ref(null)

const esImagen = computed(() => {
    if (!props.tipoArchivo) return false
    const tipo = props.tipoArchivo.toLowerCase()
    return tipo.includes('image') || tipo.includes('png') || tipo.includes('jpg') || tipo.includes('jpeg')
})

const esPdf = computed(() => {
    if (!props.tipoArchivo) return false
    return props.tipoArchivo.toLowerCase().includes('pdf')
})



onUnmounted(() => {
    document.body.style.overflow = ''
})

const cerrarVisor = () => {
    emit('update:modelValue', false)
}

watch(() => props.modelValue, async (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
        // Esperamos a que Vue dibuje el modal en el DOM
        await nextTick()
        // Le damos el foco obligatoriamente
        if (visorContenedor.value) {
            visorContenedor.value.focus()
        }
    } else {
        document.body.style.overflow = ''
    }
})


</script>