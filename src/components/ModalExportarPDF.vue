<template>
    <transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h1.5m1.5 0h.5m-3.5 3h4m-4 3h4"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Exportar a PDF</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Tamaño Oficio - Formato Horizontal</p>
                    </div>
                </div>

                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Bandeja a exportar</label>
                        <select v-model="exportarParams.tipo" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500">
                            <option value="todos">Toda la actividad (Entrada y Enviados)</option>
                            <option value="entrada">Solo Bandeja de Entrada</option>
                            <option value="enviados">Solo Mis Enviados</option>
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Año</label>
                            <select v-model="exportarParams.anio" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500">
                                <option v-for="anio in opcionesAnios" :key="anio" :value="anio">{{ anio }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Periodo</label>
                            <select v-model="exportarParams.trimestre" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500">
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
                    <button @click="generarYDescargarPDF" :disabled="exportando" class="px-4 py-2 text-sm font-bold text-white bg-[#AB0033] rounded-lg hover:bg-[#8A0029] disabled:bg-[#AB0033]/50 transition-colors flex items-center gap-2">
                        <svg v-if="exportando" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ exportando ? 'Procesando...' : 'Descargar PDF' }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoSIA from '@/assets/logo-transparente.png'
// --- IMPORTAMOS EL SERVICIO ---
import { inventarioService } from '@/services/inventarioService'


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

watch(() => props.modelValue, (isOpen) => {
    if (isOpen) exportarParams.value.anio = props.anioDefecto;
})

const cerrarModal = () => {
    emit('update:modelValue', false)
}

const formatFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const [year, month, day] = fechaISO.split("-");
    return `${day}/${month}/${year}`;
};

const generarYDescargarPDF = async () => {
    try {
        exportando.value = true;
        
        const anio = exportarParams.value.anio;
        let fechaInicio = `${anio}-01-01`;
        let fechaFin = `${anio}-12-31`;

        if (exportarParams.value.trimestre === '1') { fechaInicio = `${anio}-01-01`; fechaFin = `${anio}-03-31`; }
        else if (exportarParams.value.trimestre === '2') { fechaInicio = `${anio}-04-01`; fechaFin = `${anio}-06-30`; }
        else if (exportarParams.value.trimestre === '3') { fechaInicio = `${anio}-07-01`; fechaFin = `${anio}-09-30`; }
        else if (exportarParams.value.trimestre === '4') { fechaInicio = `${anio}-10-01`; fechaFin = `${anio}-12-31`; }

        const secId = props.seccionId;

        // --- LLAMADA LIMPIA AL SERVICIO (Reutilizamos la misma función del CSV) ---
        const data = await inventarioService.obtenerExpedientesParaExportar(secId, exportarParams.value.tipo, fechaInicio, fechaFin);

        if (!data || data.length === 0) {
            toast.info("No hay registros en este periodo y bandeja para exportar.");
            exportando.value = false;
            return;
        }

        const nombreSeccion = props.miSeccion?.seccion || "No definida";
        const codigoSeccion = props.miSeccion?.codigo || "S/C";
        let tipoEtiqueta = "Trámite";
        if(exportarParams.value.tipo === 'entrada') tipoEtiqueta = "Bandeja de Entrada";
        if(exportarParams.value.tipo === 'enviados') tipoEtiqueta = "Enviados";

        // --- 1. CONFIGURAR EL DOCUMENTO PDF ---
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'legal'
        });

        const img = new Image();
        img.src = logoSIA;
        await new Promise((resolve) => {
            img.onload = resolve;
        });

        doc.addImage(img, 'PNG', 300, 20, 24, 24);

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INVENTARIO DE EXPEDIENTES', pageWidth / 2, 15, { align: 'center' });
        doc.text("CONSEJERÍA JURÍDICA DEL PODER EJECUTIVO DEL ESTADO DE GUERRERO", pageWidth / 2, 20, { align: 'center' });
        
        const fechaActual = new Date().toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha de exportación: ${fechaActual}`, pageWidth - 14, 47, { align: 'right' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Sección: ${nombreSeccion}`, 14, 32);
        doc.text(`Código: ${codigoSeccion}`, 14, 38);
        doc.text(`Tipo: ${tipoEtiqueta}`, 14, 44);

        // --- 2. CABECERAS DE LA TABLA ---
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
            const soporteLimpio = item.soporte ? String(item.soporte).replace(/[[\]"{}]/g, "") : '';
            const tradicionLimpia = item.tradicion ? String(item.tradicion).replace(/[[\]"{}]/g, "") : '';
            const condicionLimpia = item.condicion_acceso ? String(item.condicion_acceso).replace(/[[\]"{}]/g, "") : '';

            // Obtenemos la fecha de clasificación del JSON (Si existe, la formateamos, si no, lo dejamos en blanco)
            const fechaCierreRaw = item.snapshot_cadido?.fecha_clasificacion || '';
            const fechaCierre = fechaCierreRaw ? formatFecha(fechaCierreRaw.split('T')[0]) : '';

            return [
                item.numero_consecutivo || "",
                item.asunto || "",
                item.fojas?.toString() || "",
                soporteLimpio,
                item.snapshot_cadido?.valor_documental || "",
                item.snapshot_cadido?.anios_tramite?.toString() || "",
                item.snapshot_cadido?.anios_concentracion?.toString() || "",
                tradicionLimpia,
                condicionLimpia,
                formatFecha(item.fecha_registro),
                fechaCierre, // <--- NUEVO CAMPO MAPEADO
                "OFICINAS DE LA CONSEJERIA JURIDICA",
                item.inmueble || ""
            ];
        });

        // --- 4. DIBUJAR LA TABLA CON AUTOTABLE ---
        autoTable(doc, {
            startY: 50, 
            head: [cabeceras],
            body: filas,
            headStyles: { 
                fillColor: '#AB0033', // Guinda 
                textColor: '#FFFFFF', // Texto Blanco
                fontSize: 8,
                halign: 'center'
            },
            styles: { 
                fontSize: 7, 
                cellPadding: 2,
                overflow: 'linebreak'
            },
            alternateRowStyles: {
                fillColor: '#f9fafb' 
            },
            columnStyles: {
                1: { cellWidth: 45 }, // Asunto (Reducido ligeramente)
                12: { cellWidth: 35 } // URL/Mobiliario (Ajustado para darle espacio a las 2 fechas)
            }
        });

        // --- 5. GUARDAR Y DESCARGAR ---
        const nombreArchivo = `Inventario_${codigoSeccion}_${exportarParams.value.tipo}_${anio}_Q${exportarParams.value.trimestre}.pdf`;
        doc.save(nombreArchivo);
        
        toast.success("Archivo PDF exportado correctamente.");
        cerrarModal();

    } catch (error) {
        console.error("Error al exportar PDF:", error);
        toast.error("Ocurrió un error al generar el PDF.");
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