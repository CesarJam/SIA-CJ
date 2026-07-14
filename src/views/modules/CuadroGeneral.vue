<template>
    <div class="fade-in relative min-h-screen pb-10">

        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Cuadro General de Clasificación</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Catálogo de secciones y funciones
                    sustantivas/comunes.</p>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
                <button @click="exportarCSV"
                    class="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    CSV
                </button>
                <button @click="exportarPDF"
                    class="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#AB0033] hover:bg-[#8A0029] rounded-lg shadow-sm transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    PDF
                </button>

                <button v-if="userRole === 'admin'" @click="abrirModalNuevo"
                    class="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    + Registrar
                </button>
            </div>
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/5">Código</div>
                <div class="w-1/5">Sección</div>
                <div class="w-1/5">Función</div>
                <div v-if="userRole === 'admin'" class="w-1/5 text-center">Acción</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">

                <div v-for="item in listaCuadro" :key="item.id"
                    class="p-4 md:px-6 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <div class="w-full md:w-1/5 flex items-center justify-between md:justify-start">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Código:</span>
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.codigo }}</span>
                    </div>

                    <div class="ww-full md:w-1/5 flex items-center justify-between md:justify-start">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Sección:</span>
                        <span class="text-gray-800 dark:text-gray-200">{{ item.seccion }}</span>
                    </div>

                    <div class="w-full md:w-1/4 flex items-center justify-between md:justify-start mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Función:</span>
                        <span class="text-gray-800 dark:text-gray-200">{{ item.funcion }}</span>
                    </div>

                    <div v-if="userRole === 'admin'"
                        class="flex items-center gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 w-full md:w-auto justify-end shrink-0">
                        <button @click="abrirModalEdicion(item)"
                            class="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                </path>
                            </svg>

                        </button>
                        <button @click="eliminarRegistro(item.id, item.codigo)"
                            class="flex items-center gap-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>

                        </button>
                    </div>
                </div>

            </div>

            <!--Estado de Carga y Estado Vacío -->
            <div v-if="loading" class="text-center py-12 text-gray-500 flex flex-col items-center">
                <svg class="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Cargando Cuadro General...
            </div>
            <div v-else-if="listaCuadro.length === 0" class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">No hay secciones registradas en el catálogo.</p>
            </div>

        </div>

        <div
            :class="['fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6', modalAbierto ? 'pointer-events-auto' : 'pointer-events-none']">

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalAbierto" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    @click="cerrarModal"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-if="modalAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col border border-gray-100 dark:border-gray-700">

                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 rounded-t-2xl">
                        <h2 class="text-lg font-bold text-gray-800 dark:text-white">{{ editandoId ? 'Editar Elemento' :
                            'Registrar Elemento' }}</h2>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 space-y-5">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código de
                                Sección</label>
                            <input v-model="form.codigo" type="text" placeholder="Ej: CJ.1"
                                class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                                :disabled="editandoId">
                            <p v-if="editandoId" class="text-xs text-orange-500 mt-1">El código no puede modificarse al
                                editar.</p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre de
                                la Sección</label>
                            <input v-model="form.seccion" type="text" placeholder="Ej: PRUEBA LOCAL"
                                class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                        </div>
                        <div>
                            <label
                                class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Función</label>
                            <select v-model="form.funcion"
                                class="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                <option value="Sustantivas">Sustantivas</option>
                                <option value="Comunes">Comunes</option>
                            </select>
                        </div>
                    </div>

                    <div
                        class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-900/40 rounded-b-2xl">
                        <button @click="cerrarModal"
                            class="flex-1 py-2.5 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">Cancelar</button>
                        <button @click="guardarRegistro"
                            class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transform transition-all active:scale-95">
                            {{ editandoId ? 'Modificar' : 'Guardar' }}
                        </button>
                    </div>

                </div>
            </transition>
        </div>

        <ConfirmModal :isOpen="modalEliminar.abierto" title="Eliminar Sección"
            :message="`¿Estás seguro de que deseas eliminar la sección '${modalEliminar.codigo}'? Esta acción no se puede deshacer.`"
            confirmText="Sí, eliminar" @confirm="confirmarEliminacion" @cancel="cancelarEliminacion" />

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { cuadroGeneralService } from '@/services/cuadroGeneralService'
import { useToast } from '@/composables/useToast'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoSIA from '@/assets/logo-transparente.png'

const ConfirmModal = defineAsyncComponent(() => import('@/components/ConfirmModal.vue'))

const route = useRoute()
const userRole = ref(route.meta.userRole || 'cliente')
const toast = useToast()
const loading = ref(true)
const listaCuadro = ref([])
const modalAbierto = ref(false)
const editandoId = ref(null)

const form = ref({
    codigo: '',
    seccion: '',
    funcion: 'Sustantivas'
})

const modalEliminar = ref({
    abierto: false,
    id: null,
    codigo: ''
})

// === CARGA DE DATOS (REFACTORIZADO) ===
const cargarDatos = async () => {
    loading.value = true
    try {
        // Llamada limpia al servicio
        listaCuadro.value = await cuadroGeneralService.obtenerTodos()
    } catch (error) {
        console.error("Error al cargar Cuadro General:", error)
        toast.error("Error al cargar el catálogo de secciones.")
    } finally {
        loading.value = false
    }
}

// === LÓGICA DE TECLADO (ACCESIBILIDAD) ===
const handleKeydown = (e) => {
    if (e.key === 'Escape') {
        if (modalAbierto.value && !modalEliminar.value.abierto) {
            cerrarModal()
        }
    }
}

onMounted(async () => {
    await cargarDatos()
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})

// === GESTIÓN DEL MODAL ===
const abrirModalNuevo = () => {
    editandoId.value = null
    form.value = { codigo: '', seccion: '', funcion: 'Sustantivas' }
    modalAbierto.value = true
}

const abrirModalEdicion = (item) => {
    editandoId.value = item.id
    form.value = { codigo: item.codigo, seccion: item.seccion, funcion: item.funcion }
    modalAbierto.value = true
}

const cerrarModal = () => {
    modalAbierto.value = false
}

// === CRUD (REFACTORIZADO) ===
const guardarRegistro = async () => {
    if (!form.value.codigo || !form.value.seccion) {
        alert("Por favor completa el código y la sección.")
        return
    }

    try {
        if (editandoId.value) {
            // Llamada al servicio de actualización
            await cuadroGeneralService.actualizarRegistro(editandoId.value, {
                seccion: form.value.seccion,
                funcion: form.value.funcion
            })
            toast.success('Sección actualizada correctamente')
        } else {
            // Llamada al servicio de creación
            await cuadroGeneralService.crearRegistro({
                codigo: form.value.codigo,
                seccion: form.value.seccion,
                funcion: form.value.funcion
            })
            toast.success('Nueva sección registrada con éxito')
        }

        await cargarDatos()
        cerrarModal()

    } catch (error) {
        if (error.code === '23505') {
            toast.error('Ese código de sección ya existe')
        } else {
            console.error("Error en CRUD:", error)
            toast.error('Ocurrió un error en el servidor')
        }
    }
}

// === ELIMINAR (REFACTORIZADO) ===
const eliminarRegistro = (id, codigo) => {
    modalEliminar.value = { abierto: true, id, codigo }
}

const confirmarEliminacion = async () => {
    if (modalEliminar.value.id) {
        try {
            // Llamada al servicio de eliminación
            await cuadroGeneralService.eliminarRegistro(modalEliminar.value.id)
            await cargarDatos()
            toast.success("Sección eliminada.")
        } catch (error) {
            console.error("Error al eliminar:", error)
            toast.error("No se pudo eliminar el registro.")
        }
    }
    modalEliminar.value.abierto = false
}

const cancelarEliminacion = () => {
    modalEliminar.value.abierto = false
}

// === EXPORTAR A CSV OFICIAL ===
const exportarCSV = () => {
    if (listaCuadro.value.length === 0) {
        toast.info("No hay datos para exportar.");
        return;
    }

    // 1. Generar la fecha actual con formato en español
    const fechaActual = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // 2. Construir las filas del encabezado oficial
    const fila1 = `;"CONSEJERÍA JURÍDICA DEL PODER EJECUTIVO DEL ESTADO DE GUERRERO"`;
    const fila2 = `;"CUADRO GENERAL DE CLASIFICACIÓN ARCHIVÍSTICA"`;
    const fila3 = ``;
    const fila4 = `;"Fecha de exportación";"${fechaActual}"`;
    const fila5 = ``;

    // 3. Cabeceras de la tabla
    const cabeceras = "CÓDIGO;SECCIÓN;FUNCIÓN";

    // 4. Unir los encabezados con el BOM (para los acentos en Excel)
    let csv = `\uFEFF${fila1}\n${fila2}\n${fila3}\n${fila4}\n${fila5}\n${cabeceras}\n`;

    // 5. Mapear los datos de las secciones
    listaCuadro.value.forEach(item => {
        // Limpiamos los textos por precaución si alguien escribió comillas dobles
        const codigo = item.codigo ? String(item.codigo).replace(/"/g, '""') : '';
        const seccion = item.seccion ? String(item.seccion).replace(/"/g, '""') : '';
        const funcion = item.funcion ? String(item.funcion).replace(/"/g, '""') : '';

        csv += `"${codigo}";"${seccion}";"${funcion}"\n`;
    });

    // 6. Generar y descargar el archivo dinámicamente
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CuadroGeneral.csv";
    link.click();
    
    // 7. Limpieza de memoria
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    toast.success("Catálogo exportado correctamente.");
}

// === EXPORTAR A PDF OFICIAL ===
const exportarPDF = async () => {
    if (listaCuadro.value.length === 0) {
        toast.info("No hay datos para exportar.");
        return;
    }

    try {
        // --- 1. CONFIGURAR EL DOCUMENTO PDF ---
        // Al ser 3 columnas, usamos 'portrait' (Vertical) en tamaño 'legal' (Oficio)
        const doc = new jsPDF({
            orientation: 'portrait', 
            unit: 'mm',
            format: 'legal'
        });

        const img = new Image();
        img.src = logoSIA;
        await new Promise((resolve) => {
            img.onload = resolve;
        });

        // Calculamos el ancho de la página en formato vertical
        const pageWidth = doc.internal.pageSize.getWidth();

        // El logo lo colocamos en la esquina superior derecha dinámicamente
        doc.addImage(img, 'PNG', pageWidth - 38, 15, 24, 24);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CUADRO GENERAL DE CLASIFICACIÓN ARCHIVÍSTICA', pageWidth / 2, 20, { align: 'center' });
        doc.text("CONSEJERÍA JURÍDICA DEL", pageWidth / 2, 26, { align: 'center' });
        doc.text("PODER EJECUTIVO DEL ESTADO DE GUERRERO", pageWidth / 2, 32, { align: 'center' });
        
        const fechaActual = new Date().toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        // Fecha alineada a la izquierda en este caso para equilibrar el logo a la derecha
        doc.text(`Fecha de exportación: ${fechaActual}`, 14, 40);

        // --- 2. CABECERAS DE LA TABLA ---
        const cabeceras = ["CÓDIGO", "SECCIÓN", "FUNCIÓN"];
        
        // --- 3. MAPEAMOS LOS DATOS ---
        const filas = listaCuadro.value.map(item => [
            item.codigo || "",
            item.seccion || "",
            item.funcion || ""
        ]);

        // --- 4. DIBUJAR LA TABLA CON AUTOTABLE ---
        autoTable(doc, {
            startY: 45, 
            head: [cabeceras],
            body: filas,
            headStyles: { 
                fillColor: '#AB0033', // Guinda Institucional
                textColor: '#FFFFFF', // Texto Blanco
                fontSize: 10,
                halign: 'center'
            },
            styles: { 
                fontSize: 9, 
                cellPadding: 4,
                overflow: 'linebreak'
            },
            alternateRowStyles: {
                fillColor: '#f9fafb'
            },
            columnStyles: {
                0: { cellWidth: 40, halign: 'center' }, // Código más centrado y ajustado
                1: { cellWidth: 'auto' }, // La sección toma el espacio restante
                2: { cellWidth: 40, halign: 'center' } // Función
            }
        });

        // --- 5. GUARDAR Y DESCARGAR ---
        doc.save("CuadroGeneral.pdf");
        toast.success("Catálogo PDF exportado correctamente.");

    } catch (error) {
        console.error("Error al exportar PDF:", error);
        toast.error("Ocurrió un error al generar el documento PDF.");
    }
};
</script>