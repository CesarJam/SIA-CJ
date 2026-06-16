<template>
    <transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Exportar a Excel (CSV)</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Selecciona los parámetros de descarga</p>
                    </div>
                </div>

                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Bandeja a exportar</label>
                        <select v-model="exportarParams.tipo" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500">
                            <option value="todos">Toda la actividad (Entrada y Enviados)</option>
                            <option value="entrada">Solo Bandeja de Entrada</option>
                            <option value="enviados">Solo Mis Enviados</option>
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Año</label>
                            <select v-model="exportarParams.anio" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500">
                                <option v-for="anio in opcionesAnios" :key="anio" :value="anio">{{ anio }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Periodo</label>
                            <select v-model="exportarParams.trimestre" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500">
                                <option value="Todos">Todo el año</option>
                                <option value="1">1er Trimestre (Ene-Mar)</option>
                                <option value="2">2do Trimestre (Abr-Jun)</option>
                                <option value="3">3er Trimestre (Jul-Sep)</option>
                                <option value="4">4to Trimestre (Oct-Dic)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button @click="cerrarModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Cancelar
                    </button>
                    <button @click="generarYDescargarCSV" :disabled="exportando" class="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center gap-2">
                        <svg v-if="exportando" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ exportando ? 'Procesando...' : 'Descargar Archivo' }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'


// Recibimos las variables desde Inventario.vue
const props = defineProps({
    modelValue: Boolean,
    seccionId: String,
    miSeccion: Object,
    opcionesAnios: Array,
    anioDefecto: Number
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()
const exportando = ref(false)
const exportarParams = ref({
    tipo: 'todos',
    anio: new Date().getFullYear(),
    trimestre: 'Todos'
})

// Al abrir el modal, tomamos el año que el usuario tiene seleccionado en la tabla
watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        exportarParams.value.anio = props.anioDefecto;
    }
})

const cerrarModal = () => {
    emit('update:modelValue', false)
}

const formatFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const [year, month, day] = fechaISO.split("-");
    return `${day}/${month}/${year}`;
};

const generarYDescargarCSV = async () => {
    try {
        exportando.value = true;
        
        const anio = exportarParams.value.anio;
        let fechaInicio = `${anio}-01-01`;
        let fechaFin = `${anio}-12-31`;

        if (exportarParams.value.trimestre === '1') { fechaInicio = `${anio}-01-01`; fechaFin = `${anio}-03-31`; }
        else if (exportarParams.value.trimestre === '2') { fechaInicio = `${anio}-04-01`; fechaFin = `${anio}-06-30`; }
        else if (exportarParams.value.trimestre === '3') { fechaInicio = `${anio}-07-01`; fechaFin = `${anio}-09-30`; }
        else if (exportarParams.value.trimestre === '4') { fechaInicio = `${anio}-10-01`; fechaFin = `${anio}-12-31`; }

        let query = supabase
            .from("expedientes")
            .select("numero_consecutivo, asunto, fojas, soporte, snapshot_cadido, tradicion, condicion_acceso, fecha_registro, ubicacion_url, inmueble")
            .gte("fecha_registro", fechaInicio)
            .lte("fecha_registro", fechaFin)
            .order("fecha_registro", { ascending: true })
            .limit(5000);

        const secId = props.seccionId;

        if (exportarParams.value.tipo === "entrada") {
            query = query.eq("id_seccion_turnada", secId).neq("tipo_registro", "Enviado");
        } else if (exportarParams.value.tipo === "enviados") {
            query = query.eq("id_seccion_registro", secId).or(`id_seccion_turnada.neq.${secId},tipo_registro.eq.Enviado`);
        } else {
            query = query.or(`id_seccion_turnada.eq.${secId},id_seccion_registro.eq.${secId}`);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
            toast.info("No hay registros en este periodo y bandeja para exportar.");
            exportando.value = false;
            return;
        }

        // --- 1. CONSTRUCCIÓN DEL ENCABEZADO SUPERIOR DEL REPORTE ---
        const nombreSeccion = props.miSeccion?.seccion || "No definida";
        const codigoSeccion = props.miSeccion?.codigo || "S/C";
        let tipoEtiqueta = "Trámite";
        if(exportarParams.value.tipo === 'entrada') tipoEtiqueta = "Bandeja de Entrada";
        if(exportarParams.value.tipo === 'enviados') tipoEtiqueta = "Enviados";

        const fila1 = `;"CONSEJERÍA JURÍDICA DEL PODER EJECUTIVO DEL ESTADO DE GUERRERO"`;
        const fila2 = '';
        const fila3 = `;"Sección";"${nombreSeccion}"`;
        const fila4 = `;"Código";"${codigoSeccion}"`;
        const fila5 = `;"Tipo";"${tipoEtiqueta}"`;
        const fila6 = ``;

        // --- 2. CABECERAS DE LA TABLA (13 Columnas) ---
        const cabeceras = [
            "Numero de Expediente", 
            "Asunto", 
            "Total de Fojas", 
            "Soporte Documental", 
            "Valores Documentales", 
            "Años Trámite", 
            "Años Concentración", 
            "Tradición Documental", 
            "Condición de Acceso", 
            "Fecha de Apertura", 
            "Fecha de Cierre", 
            "Inmueble", 
            "Mobiliario y/o ruta de almacenamiento"
        ];
        
        // --- 3. MAPEAMOS LOS DATOS ---
        const filas = data.map(item => {
            const asuntoLimpio = item.asunto ? String(item.asunto).replace(/"/g, '""') : '';
            const soporteLimpio = item.soporte ? String(item.soporte).replace(/[[\]"{}]/g, "") : '';
            const tradicionLimpia = item.tradicion ? String(item.tradicion).replace(/[[\]"{}]/g, "") : '';
            const condicionLimpia = item.condicion_acceso ? String(item.condicion_acceso).replace(/[[\]"{}]/g, "") : '';
            
            // Limpiamos también el inmueble para evitar que rompa el CSV si el usuario escribe comillas
            const inmuebleLimpio = item.inmueble ? String(item.inmueble).replace(/"/g, '""') : '';

            // Lógica de Fecha de Cierre
            const fechaCierreRaw = item.snapshot_cadido?.fecha_clasificacion || '';
            const fechaCierre = fechaCierreRaw ? formatFecha(fechaCierreRaw.split('T')[0]) : '';

            const valorDoc = item.snapshot_cadido?.valor_documental || '';
            const aniosTram = item.snapshot_cadido?.anios_tramite || '';
            const aniosConc = item.snapshot_cadido?.anios_concentracion || '';

            return [
                `"${item.numero_consecutivo || ""}"`,
                `"${asuntoLimpio}"`,
                `"${item.fojas || ""}"`,
                `"${soporteLimpio}"`,
                `"${valorDoc}"`,
                `"${aniosTram}"`,
                `"${aniosConc}"`,
                `"${tradicionLimpia}"`,
                `"${condicionLimpia}"`,
                `"${formatFecha(item.fecha_registro)}"`,
                `"${fechaCierre}"`, 
                `"OFICINAS DE LA CONSEJERIA JURIDICA"`,
                `"${inmuebleLimpio}"`
            ].join(";"); 
        });

        // Ensamblamos todo el documento respetando los saltos de línea
        const contenidoCSV = [
            fila1,
            fila2,
            fila3,
            fila4,
            fila5,
            fila6,
            cabeceras.join(";"),
            ...filas
        ].join("\n");

        // 4. GENERAR DESCARGA
        const blob = new Blob(["\uFEFF" + contenidoCSV], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const nombreArchivo = `Inventario_${codigoSeccion}_${exportarParams.value.tipo}_${anio}_Q${exportarParams.value.trimestre}.csv`;
        
        link.setAttribute("href", url);
        link.setAttribute("download", nombreArchivo);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("Archivo Excel exportado correctamente.");
        cerrarModal();

    } catch (error) {
        console.error("Error al exportar:", error);
        toast.error("Ocurrió un error al generar el archivo de exportación.");
    } finally {
        exportando.value = false;
    }
};
// === CERRAR CON TECLA ESCAPE ===
const handleKeydown = (e) => {
    // Si la tecla es Esc y el modal está abierto, lo cerramos
    if (e.key === 'Escape' && props.modelValue) {
        cerrarModal();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>