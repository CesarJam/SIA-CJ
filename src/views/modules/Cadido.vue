<template>
    <div class="fade-in relative min-h-screen pb-10">
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Catálogo de Disposición Documental</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Valoración y vigencia de subseries (CADIDO).
                </p>
            </div>

            <select v-model="filtroSeccion"
                class="w-full md:w-64 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200">
                <option v-for="sec in seccionesDisponibles" :key="sec.id" :value="sec.id">
                    {{ sec.codigo }} - {{ sec.seccion }}
                </option>
            </select>

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
            </div>
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/4">Código Serie</div>
                <div class="w-1/3">Nombre de la Serie</div>
                <div class="w-1/4">Sección</div>
                <div class="w-1/6 text-center">Valoración</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-for="item in seriesFiltradas" :key="item.id"
                    class="flex flex-col transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20">

                    <div class="p-4 md:px-6 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div class="w-full md:w-1/4 flex items-center justify-between md:justify-start">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Código:</span>
                            <span class="font-bold text-gray-900 dark:text-white">{{ item.codigo_serie }}</span>
                        </div>
                        <div class="w-full md:w-1/4 flex items-center justify-between md:justify-start">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Nombre:</span>
                            <span class="text-gray-900 dark:text-white">{{ item.nombre }}</span>
                        </div>
                        <div class="w-full md:w-1/4 flex items-center justify-between md:justify-start">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Sección:</span>
                            <span class="text-blue-600 dark:text-blue-400 font-medium">{{
                                item.cuadro_general?.codigo }}</span>
                        </div>
                        <div class="w-full md:w-1/6 flex items-center justify-between md:justify-center mt-1 md:mt-0">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Subseries:</span>
                            <button @click="toggleExpandir(item.id)"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                :class="{ 'ring-2 ring-blue-500/50': filasExpandidas.includes(item.id) }">
                                <span class="font-bold">{{ item.subseries?.length || 0 }} subseries</span>
                                <svg class="w-4 h-4 transition-transform duration-300"
                                    :class="{ 'rotate-180': filasExpandidas.includes(item.id) }" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div v-show="filasExpandidas.includes(item.id)" class="px-4 pb-4 md:px-6 md:pb-4 w-full">
                        <div
                            class="bg-gray-50/80 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-inner">
                            <h4 class="font-bold text-gray-500 uppercase tracking-wider mb-3">Dictamen de
                                Subseries</h4>

                            <ul v-if="item.subseries && item.subseries.length > 0" class="flex flex-col gap-2">
                                <li v-for="(sub, index) in item.subseries" :key="index"
                                    class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-3 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 transition-colors">

                                    <div class="flex items-center gap-4 flex-1 min-w-0">
                                        <span
                                            class="text-blue-600 dark:text-blue-400 font-black w-40 shrink-0 break-words">{{
                                            sub.codigoSubserie }}</span>
                                        <span class="font-medium text-gray-800 dark:text-gray-200 truncate">{{
                                            sub.nombre }}</span>
                                    </div>

                                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                                        <span v-if="sub.valor_documental"
                                            class="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] uppercase font-bold rounded">
                                            {{ sub.valor_documental }}
                                        </span>
                                        <span v-if="sub.at !== undefined"
                                            class="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-[10px] uppercase font-bold rounded">
                                            AT: {{ sub.at }} | AC: {{ sub.ac }}
                                        </span>
                                        <span v-if="sub.tecnica_seleccion"
                                            class="px-2 py-1 text-[10px] uppercase font-bold rounded"
                                            :class="sub.tecnica_seleccion === 'Baja' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'">
                                            {{ sub.tecnica_seleccion }}
                                        </span>

                                        <button @click="abrirModalValoracion(item, sub, index)"
                                            class="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                </path>
                                            </svg>
                                            Valorar
                                        </button>
                                    </div>
                                </li>
                            </ul>

                            <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                                Esta serie no tiene subseries para valorar.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="text-center py-12 text-gray-500 flex flex-col items-center">
                <svg class="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Cargando catálogo CADIDO...
            </div>
            <div v-else-if="seriesFiltradas.length === 0" class="text-center py-12 text-gray-500">
                No hay series registradas en la sección seleccionada.
            </div>
        </div>

        <div
            :class="['fixed inset-0 z-50 flex items-center justify-center p-4', modalAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalAbierto" class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarModal">
                </div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modalAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">

                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <h2 class="text-lg font-bold text-gray-800 dark:text-white">Valoración Documental</h2>
                            <span
                                class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                Plazo Total: {{ plazoTotal }} años
                            </span>
                        </div>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors"><svg
                                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg></button>
                    </div>

                    <div class="p-6 space-y-5 bg-[#1e2330] dark:bg-[#1e2330]">
                        <h3 class="text-white text-lg font-bold mb-4 border-b border-gray-600 pb-2">Subseries</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-white mb-1.5">Código Subserie</label>
                                <input v-model="form.codigoSubserie" type="text" readonly
                                    class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-300 cursor-not-allowed opacity-80">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-white mb-1.5">Nombre</label>
                                <input v-model="form.nombre" type="text" readonly
                                    class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-300 cursor-not-allowed opacity-80">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-white mb-1.5">Valor Documental</label>
                                <select v-model="form.valor_documental"
                                    class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Contable">Contable</option>
                                </select>
                            </div>
                            <div class="flex gap-4">
                                <div class="flex-1">
                                    <label class="block text-sm font-semibold text-white mb-1.5">Años Trámite
                                        (AT)</label>
                                    <input v-model.number="form.at" type="number" min="0"
                                        class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div class="flex-1">
                                    <label class="block text-sm font-semibold text-white mb-1.5">Años Concentración
                                        (AC)</label>
                                    <input v-model.number="form.ac" type="number" min="0"
                                        class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-white mb-1.5">Téc. Selección</label>
                                <select v-model="form.tecnica_seleccion"
                                    class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="Baja">Baja</option>
                                    <option value="Archivo Histórico">Archivo Histórico</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-white mb-1.5">Datos Personales</label>
                                <select v-model="form.datos_personales"
                                    class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500">
                                    <option value="Sí">Sí</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        <div class="mt-4">
                            <label class="block text-sm font-semibold text-white mb-1.5">Observaciones</label>
                            <input v-model="form.observaciones" type="text" placeholder="Sin observaciones"
                                class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div
                        class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModal"
                            class="flex-1 py-2.5 text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
                        <button @click="guardarValoracion"
                            class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transform active:scale-95 transition-all">Guardar
                            Dictamen</button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoSIA from '@/assets/logo-transparente.png'

const toast = useToast()

// Estado Global
const loading = ref(true)
const listaSeries = ref([])
const seccionesDisponibles = ref([])
const filtroSeccion = ref('')
const filasExpandidas = ref([])

// Estado del Modal
const modalAbierto = ref(false)
const editandoSerieId = ref(null)
const editandoSubserieIndex = ref(null)

// Formulario reactivo
const form = ref({
    codigoSubserie: '',
    nombre: '',
    valor_documental: 'Administrativo',
    at: 1,
    ac: 5,
    tecnica_seleccion: 'Baja',
    datos_personales: 'No',
    observaciones: 'Sin observaciones'
})

// Cómputo en Tiempo Real
const plazoTotal = computed(() => {
    const at = Number(form.value.at) || 0
    const ac = Number(form.value.ac) || 0
    return at + ac
})

// Filtrado de Tabla
const seriesFiltradas = computed(() => {
    return listaSeries.value.filter(serie => serie.id_seccion === filtroSeccion.value)
})

const toggleExpandir = (id) => {
    const index = filasExpandidas.value.indexOf(id)
    if (index > -1) filasExpandidas.value.splice(index, 1)
    else filasExpandidas.value.push(id)
}

// Carga de Datos y Secciones Permitidas
const cargarInformacion = async () => {
    loading.value = true

    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: userData } = await supabase.from('usuarios').select('secciones_permitidas, rol').eq('email', user.email).single()

        let querySec = supabase.from('cuadro_general').select('id, codigo, seccion').order('codigo')
        if (userData.rol !== 'admin') {
            querySec = querySec.in('codigo', userData.secciones_permitidas)
        }
        const { data: secciones } = await querySec
        seccionesDisponibles.value = secciones || []

        if (seccionesDisponibles.value.length > 0 && !filtroSeccion.value) {
            filtroSeccion.value = seccionesDisponibles.value[0].id
        }

        const { data: series } = await supabase.from('series').select('*, cuadro_general(codigo, seccion)').order('codigo_serie')
        listaSeries.value = series || []

    } catch (error) {
        console.error("Error al cargar CADIDO:", error)
        toast.error("Error al cargar la información del catálogo.")
    } finally {
        loading.value = false
    }
}

// Abrir Modal e inyectar valores por defecto si la subserie está "limpia"
const abrirModalValoracion = (serie, subserie, index) => {
    editandoSerieId.value = serie.id
    editandoSubserieIndex.value = index

    // Clonamos los datos, si no tiene valores de CADIDO, le ponemos los defaults
    form.value = {
        codigoSubserie: subserie.codigoSubserie,
        nombre: subserie.nombre,
        valor_documental: subserie.valor_documental || 'Administrativo',
        at: subserie.at !== undefined ? subserie.at : 1,
        ac: subserie.ac !== undefined ? subserie.ac : 5,
        tecnica_seleccion: subserie.tecnica_seleccion || 'Baja',
        datos_personales: subserie.datos_personales || 'No',
        observaciones: subserie.observaciones || 'Sin observaciones'
    }

    modalAbierto.value = true
}

const cerrarModal = () => {
    modalAbierto.value = false
}

// Actualizar JSONB en Base de Datos
const guardarValoracion = async () => {
    // 1. Buscamos la serie completa en nuestra lista actual
    const serieBase = listaSeries.value.find(s => s.id === editandoSerieId.value)
    if (!serieBase) return toast.error('Error de consistencia. Serie no encontrada.')

    // 2. Creamos una copia profunda del arreglo de subseries para mutarlo
    const subseriesActualizadas = JSON.parse(JSON.stringify(serieBase.subseries))

    // 3. Reemplazamos el objeto de la subserie específica con los datos del formulario
    subseriesActualizadas[editandoSubserieIndex.value] = { ...form.value }

    // 4. Enviamos el UPDATE a Supabase apuntando solo a la columna JSONB 'subseries'
    const { error } = await supabase
        .from('series')
        .update({ subseries: subseriesActualizadas })
        .eq('id', editandoSerieId.value)

    if (error) {
        return toast.error(error.message || 'Error al guardar la valoración')
    }

    toast.success('Valores documentales actualizados')
    await cargarInformacion()
    cerrarModal()
}

// Exportación CSV especializada para CADIDO
const exportarCSV = () => {
    // 1. Obtener la información de la sección seleccionada actualmente
    const seccionSeleccionada = seccionesDisponibles.value.find(s => s.id === filtroSeccion.value);
    const nombreSeccion = seccionSeleccionada ? seccionSeleccionada.seccion : "No definida";
    const codigoSeccion = seccionSeleccionada ? seccionSeleccionada.codigo : "S/C";

    // 2. Generar la fecha actual con formato en español
    const fechaActual = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // 3. Construir las filas del encabezado oficial
    const fila1 = `;"CONSEJERÍA JURÍDICA DEL PODER EJECUTIVO DEL ESTADO DE GUERRERO"`;
    const fila2 = ``;
    const fila3 = `;"Sección";"${nombreSeccion}"`;
    const fila4 = `;"Código";"${codigoSeccion}"`;
    const fila5 = `;"Fecha de exportación";"${fechaActual}"`;
    const fila6 = ``;

    // 4. Tus nuevas cabeceras modificadas
    const cabeceras = "CÓDIGO SERIE;SERIE;CÓDIGO SUBSERIE;SUBSERIE;VALOR DOCUMENTAL;AÑOS TRÁMITE;AÑOS CONCENTRACIÓN;TOTAL;DESTINO;DATOS PERSONALES;OBSERVACIONES";

    // 5. Unir los encabezados con el BOM (para los acentos en Excel)
    let csv = `\uFEFF${fila1}\n${fila2}\n${fila3}\n${fila4}\n${fila5}\n${fila6}\n${cabeceras}\n`;

    // 6. Mapear los datos de las series
    seriesFiltradas.value.forEach(serie => {
        if (serie.subseries && serie.subseries.length > 0) {
            serie.subseries.forEach(sub => {
                const at = sub.at || 0;
                const ac = sub.ac || 0;
                const total = at + ac;
                const valor = sub.valor_documental || 'No asignado';
                const destino = sub.tecnica_seleccion || 'No asignado';
                const dp = sub.datos_personales || 'No';
                
                // Limpiamos observaciones por si el usuario escribió comillas dobles
                const obs = sub.observaciones ? String(sub.observaciones).replace(/"/g, '""') : '';

                csv += `"${serie.codigo_serie}";"${serie.nombre}";"${sub.codigoSubserie}";"${sub.nombre}";"${valor}";${at};${ac};${total};"${destino}";"${dp}";"${obs}"\n`;
            });
        }
    });

    // 7. Generar y descargar el archivo dinámicamente con el nombre de la sección
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CADIDO_${codigoSeccion}.csv`;
    link.click();
    
    // Limpieza de memoria (buena práctica en JS)
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Exportación a PDF Oficial para CADIDO
const exportarPDF = async () => {
    try {
        const seccionSeleccionada = seccionesDisponibles.value.find(s => s.id === filtroSeccion.value);
        const nombreSeccion = seccionSeleccionada ? seccionSeleccionada.seccion : "No definida";
        const codigoSeccion = seccionSeleccionada ? seccionSeleccionada.codigo : "S/C";

        // --- 1. CONFIGURAR EL DOCUMENTO PDF ---
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'legal' // Tamaño oficio
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
        doc.text('CATÁLOGO DE DISPOSICIÓN DOCUMENTAL (CADIDO)', pageWidth / 2, 15, { align: 'center' });
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

        // --- 2. CABECERAS DE LA TABLA (Tus 11 columnas) ---
        const cabeceras = [
            "Código Serie", 
            "Serie", 
            "Código Subserie", 
            "Subserie", 
            "Valor Documental", 
            "Años Trámite", 
            "Años Concentración", 
            "Total", 
            "Destino", 
            "Datos Personales", 
            "Observaciones"
        ];
        
        // --- 3. MAPEAMOS LOS DATOS ---
        const filas = [];
        seriesFiltradas.value.forEach(serie => {
            if (serie.subseries && serie.subseries.length > 0) {
                serie.subseries.forEach(sub => {
                    const at = sub.at || 0;
                    const ac = sub.ac || 0;
                    const total = at + ac;
                    const valor = sub.valor_documental || 'No asignado';
                    const destino = sub.tecnica_seleccion || 'No asignado';
                    const dp = sub.datos_personales || 'No';
                    const obs = sub.observaciones || '';

                    filas.push([
                        serie.codigo_serie,
                        serie.nombre,
                        sub.codigoSubserie,
                        sub.nombre,
                        valor,
                        at.toString(),
                        ac.toString(),
                        total.toString(),
                        destino,
                        dp,
                        obs
                    ]);
                });
            }
        });

        if (filas.length === 0) {
            toast.info("No hay subseries valoradas para exportar en esta sección.");
            return;
        }

        // --- 4. DIBUJAR LA TABLA CON AUTOTABLE ---
        autoTable(doc, {
            startY: 50, 
            head: [cabeceras],
            body: filas,
            headStyles: { 
                fillColor: '#AB0033', // Guinda institucional
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
                1: { cellWidth: 40 }, // Serie
                3: { cellWidth: 45 }, // Subserie
                10: { cellWidth: 35 } // Observaciones
            }
        });

        // --- 5. GUARDAR Y DESCARGAR ---
        const nombreArchivo = `CADIDO_${codigoSeccion}.pdf`;
        doc.save(nombreArchivo);
        
        toast.success("Catálogo PDF exportado correctamente.");

    } catch (error) {
        console.error("Error al exportar CADIDO a PDF:", error);
        toast.error("Ocurrió un error al generar el documento PDF.");
    }
};

const handleKeydown = (e) => {
    if (e.key === 'Escape' && modalAbierto.value) cerrarModal()
}

onMounted(() => {
    cargarInformacion()
    document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>