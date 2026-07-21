<template>
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <div v-if="modo !== 'lectura'" class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <label 
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="manejarDrop"
                :class="[
                    'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    isDragging 
                        ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/40' // Color activo al arrastrar encima
                        : 'border-indigo-300 bg-indigo-50/30 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' // Color normal
                ]"
            >
                <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                    <svg :class="['w-8 h-8 mb-3 transition-colors', isDragging ? 'text-indigo-600' : 'text-indigo-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p class="mb-1 text-sm text-gray-600 dark:text-gray-300">
                        <span class="font-bold text-indigo-600 dark:text-indigo-400">
                            {{ isDragging ? 'Suelta tus archivos aquí' : 'Haz clic para subir o arrastra tus archivos' }}
                        </span>
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG (Max. 10MB)</p>
                </div>
                <input type="file" class="hidden" multiple @change="manejarSubidaArchivo" :disabled="subiendo" accept=".pdf,.jpg,.jpeg,.png" />
            </label>

            <div v-if="subiendo" class="mt-4">
                <div class="flex justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <span>Subiendo archivo(s)...</span>
                    <span>Procesando</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden">
                    <div class="bg-indigo-600 h-1.5 rounded-full animate-pulse w-full"></div>
                </div>
            </div>
        </div>

        <div class="p-0">
            <div v-if="cargandoArchivos" class="p-6 text-center text-sm text-gray-500">
                Cargando archivos del expediente...
            </div>
            <div v-else-if="archivos.length === 0" class="p-6 text-center text-sm text-gray-500 italic">
                No hay documentos digitales anexados a este folio.
            </div>
            <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                <li v-for="archivo in archivos" :key="archivo.id" class="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg shrink-0" v-if="archivo.tipo_mime === 'application/pdf'">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </div>
                        <div class="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg shrink-0" v-else>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <div class="flex flex-col min-w-0">
                            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{{ archivo.nombre_archivo }}</span>
                            <div class="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold mt-0.5">
                                <span>{{ formatBytes(archivo.tamano_bytes) }}</span>
                                <span>•</span>
                                <span>{{ formatFecha(archivo.created_at) }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-1 shrink-0 ml-2">
                        <button @click="abrirVisor(archivo)" title="Ver Documento" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>

                        <button @click="descargarArchivo(archivo)" title="Descargar" class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>

                        <button v-if="modo !== 'lectura'" @click="eliminarArchivo(archivo)" title="Eliminar" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>

                </li>
            </ul>
        </div>

        <ModalVisor
            v-model="visorAbierto"
            :urlArchivo="archivoActualUrl"
            :nombreArchivo="archivoActualNombre"
            :tipoArchivo="archivoActualTipo"
        />

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'
import ModalVisor from '@/components/ModalVisor.vue' 
import { archivosService } from '@/services/archivosService'

const props = defineProps({
    expedienteId: { type: String, required: true },
    grupoId: { type: String, required: true },
    folio: { type: String, required: true },
    modo: { type: String, default: 'escritura' } 
})

const toast = useToast()
const archivos = ref([])
const cargandoArchivos = ref(false)
const subiendo = ref(false)

// Estado para la animación de "Arrastrar y Soltar"
const isDragging = ref(false)
const visorAbierto = ref(false)
const archivoActualUrl = ref('')
const archivoActualNombre = ref('')
const archivoActualTipo = ref('')

const cargarArchivos = async () => {
    if (!props.grupoId) return; 

    cargandoArchivos.value = true
    try {
        archivos.value = await archivosService.obtenerArchivosAnexos(props.grupoId)
    } catch (error) {
        toast.error("Error al cargar los documentos anexos.")
    } finally {
        cargandoArchivos.value = false
    }
}

// Nueva función exclusiva para procesar el "Drop" (Soltar)
const manejarDrop = (event) => {
    isDragging.value = false
    // Extraemos los archivos del evento dataTransfer en lugar del input target
    const files = event.dataTransfer.files
    procesarArchivos(files)
}

// Modificamos la función del botón de buscar para que use la misma lógica central
const manejarSubidaArchivo = (event) => {
    const files = event.target.files
    procesarArchivos(files)
}

// Lógica central para subir archivos a Supabase (usada tanto por click como por drag & drop)
const procesarArchivos = async (files) => {
    if (!files || files.length === 0) return

    subiendo.value = true

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
            if (!allowedTypes.includes(file.type)) {
                toast.error(`El archivo ${file.name} no es un formato válido.`)
                continue
            }
            await archivosService.subirArchivo(file, props.grupoId, props.expedienteId)
        }

        toast.success("Archivo(s) subido(s) correctamente.")
        await cargarArchivos()
    } catch (error) {
        toast.error(error.message || "Error al subir el archivo.")
    } finally {
        subiendo.value = false
    }
}

const abrirVisor = async (archivo) => {
    try {
        archivoActualUrl.value = await archivosService.obtenerUrlFirmada(archivo.ruta_supabase)
        archivoActualNombre.value = archivo.nombre_archivo
        archivoActualTipo.value = archivo.tipo_mime
        
        visorAbierto.value = true
    } catch (error) {
        toast.error("Error al obtener la vista previa del documento.")
    }
}

const descargarArchivo = async (archivo) => {
    try {
        const blob = await archivosService.descargarBlob(archivo.ruta_supabase)
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = archivo.nombre_archivo
        a.click()
        URL.revokeObjectURL(url)
    } catch (error) {
        toast.error("Error al descargar el documento.")
    }
}

const eliminarArchivo = async (archivo) => {
    if (!confirm(`¿Estás seguro de eliminar el archivo ${archivo.nombre_archivo}?`)) return
    
    try {
        await archivosService.eliminarArchivoCompleto(archivo.id, archivo.ruta_supabase)
        
        toast.success("Archivo eliminado.")
        await cargarArchivos()
    } catch (error) {
        toast.error("Error al eliminar el archivo.")
    }
}

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const formatFecha = (isoString) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleDateString('es-MX')
}

watch(() => props.expedienteId, cargarArchivos)
onMounted(cargarArchivos)
</script>