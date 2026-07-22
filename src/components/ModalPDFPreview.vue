<template>
    <div
        :class="['fixed inset-0 z-[100] flex items-center justify-center p-4', modelValue ? 'pointer-events-auto' : 'pointer-events-none']">
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue" class="absolute inset-0 bg-black/80 backdrop-blur-sm"
                @click="$emit('update:modelValue', false)"></div>
        </transition>

        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="modelValue"
                class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                <div class="px-4 py-3 bg-gray-900 text-white flex justify-between items-center shrink-0">
                    <span class="text-sm font-bold tracking-wide">Previsualización de Documento</span>
                    <button @click="$emit('update:modelValue', false)"
                        class="text-gray-400 hover:text-red-400 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="flex-1 bg-gray-100 dark:bg-gray-900 w-full">
                    <iframe v-if="signedUrl" :src="signedUrl" class="w-full h-full border-none"></iframe>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { inventarioService } from '@/services/inventarioService';

const props = defineProps({
    modelValue: Boolean,
    rutaArchivo: String // Recibe la ruta desde Inventario.vue
});

const emit = defineEmits(['update:modelValue']);
const signedUrl = ref(null);

// 2. Función para manejar la tecla Esc
const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.modelValue) {
        emit('update:modelValue', false);
    }
};

// 3. Registrar el evento al montar y quitarlo al desmontar
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

watch(() => props.rutaArchivo, async (newRuta) => {
    if (newRuta) {
        try {
            // Obtenemos la URL firmada desde el servicio
            signedUrl.value = await inventarioService.obtenerUrlFirmada(newRuta, 3600); // 1 hora de validez
        } catch (error) {
            console.error("Error al generar la URL de previsualización:", error);
            signedUrl.value = null;
        }
    } else {
        signedUrl.value = null;
    }
});
</script>