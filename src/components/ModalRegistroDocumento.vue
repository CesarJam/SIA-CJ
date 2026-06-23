<template>
    <div>
        <div
            :class="['fixed inset-0 z-[70] flex items-center justify-center p-4', modalDependenciaAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalDependenciaAbierto" class="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    @click="cerrarModalDependencia"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95 translate-y-4"
                enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95 translate-y-4">
                <div v-if="modalDependenciaAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                    <div
                        class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-gray-800 dark:text-white">Nueva Dependencia</h2>
                        <button @click="cerrarModalDependencia"
                            class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 space-y-5">
                        <div>
                            <label class="block text-sm font-bold text-gray-500 uppercase mb-1.5">Nombre Oficial <span
                                    class="text-red-500">*</span></label>
                            <input v-model="formDependencia.nombre_oficial" type="text"
                                placeholder="Ej: Secretaría de Salud"
                                class="w-full px-3 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-gray-500 uppercase mb-1.5">Siglas</label>
                                <input v-model="formDependencia.siglas" type="text" placeholder="Ej: SSG"
                                    class="w-full px-3 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-500 uppercase mb-1.5">Tipo</label>
                                <select v-model="formDependencia.tipo_ente"
                                    class="w-full px-3 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    <option value="Estatal">Estatal</option>
                                    <option value="Federal">Federal</option>
                                    <option value="Municipal">Municipal</option>
                                    <option value="Órgano Autónomo">Órgano Autónomo</option>
                                    <option value="Privado">Privado</option>
                                    <option value="Ciudadano">Ciudadano</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-500 uppercase mb-1.5">Titular /
                                Representante</label>
                            <input v-model="formDependencia.titular" type="text" placeholder="Nombre completo"
                                class="w-full px-3 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>

                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalDependencia" :disabled="procesandoDependencia"
                            class="px-5 py-2.5 text-base text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
                        <button @click="guardarDependencia" :disabled="procesandoDependencia"
                            class="px-5 py-2.5 text-base bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 flex items-center gap-2">
                            <span v-if="procesandoDependencia" class="animate-pulse">Guardando...</span>
                            <span v-else>Guardar</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <div
            :class="['fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6', modelValue ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modelValue" class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cerrarModal"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modelValue"
                    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 max-h-[90vh]">

                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex justify-between items-center shrink-0">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                            {{ isEditing ? 'Editar Registro' : titulo }}
                        </h2>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto space-y-6">

                        <div
                            class="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h3
                                class="text-base font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                1. Datos del Documento</h3>

                            <div class="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">

                                <div class="flex flex-col">
                                    <label class="block text-sm font-bold text-gray-500 uppercase mb-2">No.
                                        Consecutivo</label>
                                    <input v-model="form.numero_consecutivo" type="text" placeholder="Ej: CJ/DA/001/2026"
                                        required
                                        class="mt-auto w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        >
                                </div>

                                <div class="flex flex-col">
                                    <label class="block text-sm font-bold text-gray-500 uppercase mb-2">Fecha
                                        Documento <span class="text-red-500">*</span></label>
                                    <input v-model="form.fecha_registro" type="date" required
                                        class="mt-auto w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:[color-scheme:dark]">
                                </div>

                                <div class="flex flex-col">
                                    <label class="block text-sm font-bold text-gray-500 uppercase mb-2">No.
                                        Fojas</label>
                                    <input v-model.number="form.fojas" type="number" min="1" required
                                        class="mt-auto w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                </div>

                                <div class="flex flex-col">
                                    <label class="block text-sm font-bold text-gray-500 uppercase mb-2">Carácter /
                                        Prioridad</label>
                                    <select v-model="form.caracter"
                                        class="mt-auto w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                        <option value="Ordinario">Ordinario</option>
                                        <option value="Urgente">Urgente</option>
                                        <option value="Extraordinario">Extraordinario</option>
                                    </select>
                                </div>

                                <div class="flex flex-col">
                                    <label class="block text-sm font-bold text-gray-500 uppercase mb-2">Tipo de
                                        Registro</label>
                                    <select v-model="form.tipo_registro"
                                        class="mt-auto w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                        <option value="Recibido">Recibido / Interno</option>
                                        <option value="Enviado">Enviado (Salida Externa)</option>
                                    </select>
                                </div>

                                <div class="md:col-span-5 flex flex-col">
                                    <label class="block text-sm font-bold text-gray-500 uppercase mb-2">Asunto</label>
                                    <textarea v-model="form.asunto" rows="2"
                                        placeholder="Descripción breve del oficio..." required
                                        class="mt-auto w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"></textarea>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div
                                class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h3 class="text-base font-bold text-gray-700 dark:text-gray-300">
                                    2. Dependencias Involucradas
                                </h3>
                                <button class="text-sm text-indigo-600 font-bold hover:underline"
                                    @click="abrirModalDependencia">+ Nueva Dependencia</button>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-4" v-if="dependenciasSeleccionadasInfo.length > 0">
                                <span v-for="dep in dependenciasSeleccionadasInfo" :key="dep.id"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-sm border border-indigo-200 dark:border-indigo-800">
                                    {{ dep.siglas || dep.nombre_oficial }}
                                    <button @click.prevent="removerDependencia(dep.id)"
                                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-white transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </span>
                            </div>

                            <div class="relative mb-3">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input v-model="busquedaDependencia" type="text"
                                    placeholder="Buscar dependencia por nombre o siglas..."
                                    class="w-full pl-10 pr-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors">
                            </div>

                            <div
                                class="max-h-48 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 shadow-inner">
                                <label v-for="dep in dependenciasFiltradas" :key="dep.id"
                                    class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                                    <input type="checkbox" :value="dep.id" v-model="form.dependencias_ids"
                                        class="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                                    <div class="flex flex-col">
                                        <span class="text-base font-semibold text-gray-700 dark:text-gray-200">{{
                                            dep.nombre_oficial }}</span>
                                        <span v-if="dep.siglas" class="text-xs font-bold text-gray-400 mt-0.5">{{
                                            dep.siglas }}</span>
                                    </div>
                                </label>
                                <div v-if="dependenciasFiltradas.length === 0"
                                    class="text-center py-6 text-base text-gray-500">
                                    No se encontraron dependencias con "{{ busquedaDependencia }}"
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                            <div
                                class="flex justify-between items-center mb-4 border-b border-indigo-200 dark:border-indigo-800/50 pb-2">
                                <h3 class="text-base font-bold text-indigo-800 dark:text-indigo-300">
                                    3. Área Destino (Turnar a)
                                </h3>
                            </div>

                            <div v-if="!isEditing" class="space-y-3">
                                <p
                                    class="text-sm text-indigo-600 dark:text-indigo-400 mb-2 font-medium bg-indigo-100/50 dark:bg-indigo-900/30 p-3 rounded">
                                    <span class="font-bold">Nota:</span> Si no seleccionas ningún destino, el oficio se
                                    registrará como un <strong>Trámite Interno Local</strong> para tu propia área.
                                </p>
                                <div class="max-h-48 overflow-y-auto space-y-1">
                                    <label v-for="sec in catalogoSeccionesAFiltrar" :key="sec.id"
                                        class="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                        <input type="checkbox" :value="sec.id" v-model="form.areas_destino"
                                            class="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                                        <span class="text-base text-gray-700 dark:text-gray-200"><strong
                                                class="text-indigo-600 dark:text-indigo-400">{{ sec.codigo }}</strong> -
                                            {{ sec.seccion }}</span>
                                    </label>
                                </div>
                            </div>

                            <div v-else>
                                <select v-model="form.id_seccion_turnada"
                                    class="w-full px-3 py-2.5 text-base bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    <option v-for="sec in catalogoSeccionesAFiltrar" :key="sec.id" :value="sec.id">
                                        {{ sec.codigo }} - {{ sec.seccion }}
                                    </option>
                                </select>
                                <p class="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-2">Al editar, solo
                                    puedes modificar el destino de esta copia en específico.</p>
                            </div>
                        </div>

                    </div>

                    <div
                        class="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40 shrink-0">
                        <button @click="cerrarModal" :disabled="procesando"
                            class="px-5 py-2.5 text-base text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">Cancelar</button>
                        <button @click="isEditing ? ejecutarEdicion() : ejecutarTurnado()" :disabled="procesando"
                            class="px-6 py-2.5 text-base bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transform transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                            <span v-if="procesando">Procesando...</span>
                            <span v-else>Registrar y Turnar</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const props = defineProps({
    modelValue: { type: Boolean, required: true }, // v-model para abrir/cerrar
    origenId: { type: String, required: true }, // El ID de la sección que está creando el oficio
    titulo: { type: String, default: 'Registrar Documento' },
    datosEditar: { type: Object, default: null } // Si viene lleno, es modo edición
})

const emit = defineEmits(['update:modelValue', 'guardado'])
const toast = useToast()

const procesando = ref(false)
const usuarioActual = ref(null)

// Catálogos
const catalogoDependencias = ref([])
const catalogoSecciones = ref([])
const busquedaDependencia = ref('')

//
const obtenerFechaActual = () => {
    const hoy = new Date()
    const year = hoy.getFullYear()
    const month = String(hoy.getMonth() + 1).padStart(2, '0')
    const day = String(hoy.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}` // Formato YYYY-MM-DD que requiere el input date
}

const nomenclaturaUsuario = ref('')

// Formulario Principal
const form = ref({
    numero_consecutivo: '',
    fojas: 1,
    asunto: '',
    caracter: 'Ordinario',
    tipo_registro: 'Enviado',
    dependencias_ids: [],
    areas_destino: [],
    id_seccion_turnada: null,
    caracter: 'Ordinario',
    fecha_registro: obtenerFechaActual()
})

// === ESTADOS DE EDICIÓN ===
const isEditing = computed(() => !!props.datosEditar)

watch(() => props.modelValue, async (nuevoValor) => {
    if (nuevoValor) {
        await cargarCatalogos()
        if (isEditing.value) {
            form.value = {
                numero_consecutivo: props.datosEditar.numero_consecutivo,
                fojas: props.datosEditar.fojas,
                asunto: props.datosEditar.asunto,
                dependencias_ids: props.datosEditar.dependencias_ids || [],
                areas_destino: [],
                id_seccion_turnada: props.datosEditar.id_seccion_turnada,
                caracter: props.datosEditar.caracter,
                fecha_registro: props.datosEditar.fecha_registro || obtenerFechaActual(),
                tipo_registro: props.datosEditar.tipo_registro || 'Recibido'
            }
        } else {
            form.value = {
                numero_consecutivo: nomenclaturaUsuario.value, 
                fojas: 1, 
                asunto: '', 
                dependencias_ids: [],
                areas_destino: [], 
                id_seccion_turnada: null, 
                caracter: 'Ordinario', 
                tipo_registro: 'Enviado',
                fecha_registro: obtenerFechaActual()
            }
        }
    }
})

// === MODAL SECUNDARIO: NUEVA DEPENDENCIA ===
const modalDependenciaAbierto = ref(false)
const procesandoDependencia = ref(false)
const formDependencia = ref({ nombre_oficial: '', siglas: '', titular: '', tipo_ente: 'Estatal' })

const abrirModalDependencia = () => {
    formDependencia.value = { nombre_oficial: '', siglas: '', titular: '', tipo_ente: 'Estatal' }
    modalDependenciaAbierto.value = true
}

const cerrarModalDependencia = () => {
    if (!procesandoDependencia.value) modalDependenciaAbierto.value = false
}

const guardarDependencia = async () => {
    formDependencia.value.nombre_oficial = formDependencia.value.nombre_oficial.trim()
    if (!formDependencia.value.nombre_oficial) return toast.error("El nombre oficial es obligatorio.")

    procesandoDependencia.value = true
    try {
        const { data, error } = await supabase.from('dependencias').insert([formDependencia.value]).select()
        if (error) {
            if (error.code === '23505') throw new Error("Ya existe una dependencia con este nombre exacto.")
            throw error
        }
        toast.success("Dependencia registrada correctamente")
        if (data && data.length > 0) {
            catalogoDependencias.value.push(data[0])
            if (!form.value.dependencias_ids.includes(data[0].id)) {
                form.value.dependencias_ids.push(data[0].id)
            }
        }
        modalDependenciaAbierto.value = false
    } catch (err) {
        toast.error(err.message || "Error al guardar la dependencia.")
    } finally {
        procesandoDependencia.value = false
    }
}

// === LÓGICA DE CATÁLOGOS ===
const cargarCatalogos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('usuarios').select('id, nomenclaturaExpedienteArea').eq('email', user.email).single()
    usuarioActual.value = userData.id
    nomenclaturaUsuario.value = userData.nomenclaturaExpedienteArea || ''

    if (catalogoDependencias.value.length === 0) {
        const { data: dependencias } = await supabase.from('dependencias').select('id, nombre_oficial, siglas').eq('activo', true).order('nombre_oficial')
        catalogoDependencias.value = dependencias || []
    }

    if (catalogoSecciones.value.length === 0) {
        const { data: secciones } = await supabase.from('cuadro_general').select('id, codigo, seccion').order('codigo')
        catalogoSecciones.value = secciones || []
    }
}

const dependenciasFiltradas = computed(() => {
    if (!busquedaDependencia.value) return catalogoDependencias.value
    const termino = busquedaDependencia.value.toLowerCase()
    return catalogoDependencias.value.filter(dep =>
        dep.nombre_oficial.toLowerCase().includes(termino) ||
        (dep.siglas && dep.siglas.toLowerCase().includes(termino))
    )
})

const dependenciasSeleccionadasInfo = computed(() => {
    return catalogoDependencias.value.filter(dep => form.value.dependencias_ids.includes(dep.id))
})

const removerDependencia = (id) => {
    form.value.dependencias_ids = form.value.dependencias_ids.filter(depId => depId !== id)
}

// Filtramos el área actual para que no se pueda turnar a sí misma
const catalogoSeccionesAFiltrar = computed(() => {
    return catalogoSecciones.value.filter(sec => sec.id !== props.origenId)
})


// === LÓGICA DE REGISTRO ===
const cerrarModal = () => {
    if (!procesando.value) emit('update:modelValue', false)
}

const ejecutarTurnado = async () => {
    form.value.numero_consecutivo = form.value.numero_consecutivo.trim()
    if (!form.value.numero_consecutivo || !form.value.asunto) return toast.error("El Folio y Asunto son obligatorios.")

    procesando.value = true
    try {
        const destinosFinales = form.value.areas_destino.length > 0
            ? form.value.areas_destino
            : [props.origenId]

        // 1. Generamos el Identificador de Grupo Compartido (Nativo de JavaScript)
        const grupoId = crypto.randomUUID();
        const batchInsertData = [];

        // 2. REGLA DE NEGOCIO: Si se turna a OTRAS áreas, generamos el "Acuse" automático para el área que lo envía
        const esTurnadoExterno = form.value.areas_destino.length > 0;
        
        if (esTurnadoExterno) {
            batchInsertData.push({
                grupo_id: grupoId,
                numero_consecutivo: form.value.numero_consecutivo,
                asunto: form.value.asunto.trim(),
                fojas: form.value.fojas,
                tipo_registro: form.value.tipo_registro,
                dependencias_ids: form.value.dependencias_ids,
                id_seccion_registro: props.origenId, // Creado por mi área
                id_seccion_turnada: props.origenId,  // Turnado a mi área (Para que se quede en mi historial)
                id_usuario_registro: usuarioActual.value,
                estatus: 'Recepcionado',
                tradicion: ['Copia'], // Es mi acuse
                caracter: form.value.caracter,
                fecha_registro: form.value.fecha_registro
            });
        }

        // 3. Generamos los registros "Clones" para las áreas que van a RECIBIR el documento
        destinosFinales.forEach((idDestino) => {
            batchInsertData.push({
                grupo_id: grupoId,
                numero_consecutivo: form.value.numero_consecutivo,
                asunto: form.value.asunto.trim(),
                fojas: form.value.fojas,
                tipo_registro: form.value.tipo_registro, // Mantenemos el tipo que seleccionó el usuario
                dependencias_ids: form.value.dependencias_ids,
                id_seccion_registro: props.origenId, // Creado por mi
                id_seccion_turnada: idDestino,       // Turnado al área destino
                id_usuario_registro: usuarioActual.value,
                estatus: 'Recepcionado', // Entra como "NUEVO" en la bandeja del destino
                // Si es un trámite puramente local mío, es el original. Si se envió afuera, el destino tiene el original.
                tradicion: !esTurnadoExterno ? ['Original'] : ['Original'], 
                caracter: form.value.caracter,
                fecha_registro: form.value.fecha_registro
            });
        });

        // 4. Insertamos todo de golpe en la base de datos
        const { error } = await supabase.from('expedientes').insert(batchInsertData)
        if (error) {
            if (error.code === '23505') throw new Error(`El folio ${form.value.numero_consecutivo} ya fue registrado.`)
            throw error
        }

        const msj = esTurnadoExterno
            ? `Oficio enviado a ${form.value.areas_destino.length} área(s). Acuse generado en su inventario.`
            : `Trámite local registrado con éxito.`;

        toast.success(msj)
        emit('guardado')
        procesando.value = false
        cerrarModal()
    } catch (err) {
        toast.error(err.message || "Error al intentar registrar el documento.")
        procesando.value = false
    } 
}

const ejecutarEdicion = async () => {
    form.value.numero_consecutivo = form.value.numero_consecutivo.trim()
    if (!form.value.numero_consecutivo || !form.value.asunto) return toast.error("El Folio y Asunto son obligatorios.")

    procesando.value = true
    try {
        const { error } = await supabase.from('expedientes').update({
            numero_consecutivo: form.value.numero_consecutivo,
            asunto: form.value.asunto.trim(),
            fojas: form.value.fojas,
            tipo_registro: form.value.tipo_registro,
            dependencias_ids: form.value.dependencias_ids,
            id_seccion_turnada: form.value.id_seccion_turnada,
            id_usuario_actualizacion: usuarioActual.value,
            caracter: form.value.caracter,
            fecha_registro: form.value.fecha_registro
        }).eq('id', props.datosEditar.id)

        if (error) {
            if (error.code === '23505') throw new Error("Ese folio ya existe en el área destino seleccionada.")
            throw error
        }

        toast.success("Registro actualizado correctamente")
        emit('guardado')
        procesando.value = false
        cerrarModal()
    } catch (err) {
        toast.error(err.message || "Error al actualizar el registro.")
        procesando.value = false
    } finally {
        procesando.value = false
    }
}

// === LÓGICA DE TECLADO (Cerrar con ESC) ===
const handleKeydown = (e) => {
    if (e.key === 'Escape') {
        // Primero verificamos si el modal secundario está abierto
        if (modalDependenciaAbierto.value) {
            cerrarModalDependencia()
        } 
        // Si no, cerramos el modal principal
        else if (props.modelValue) {
            cerrarModal()
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>