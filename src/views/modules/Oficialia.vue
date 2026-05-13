<template>
    <div class="fade-in relative min-h-screen pb-10">
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Oficialía de Partes</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Recepción, captura y turnado de
                    correspondencia.</p>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
                <button @click="abrirModalNuevo"
                    class="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                    + Nuevo Registro
                </button>
            </div>
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/6">Folio / Fecha</div>
                <div class="w-1/3">Asunto</div>
                <div class="w-1/4">Área Turnada (Destino)</div>
                <div class="w-1/6 text-center">Estatus</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-for="item in listaExpedientes" :key="item.id"
                    class="p-4 md:px-6 md:py-3.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20">

                    <div class="w-full md:w-1/6 flex flex-col md:block">
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.numero_consecutivo
                        }}</span><br>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatFecha(item.fecha_registro)
                        }}</span>
                    </div>

                    <div class="w-full md:w-1/3 flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Asunto:</span>
                        <span class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2" :title="item.asunto">{{
                            item.asunto }}</span>
                    </div>

                    <div class="w-full md:w-1/4 flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Destino:</span>
                        <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {{ item.area_destino?.codigo }} - {{ item.area_destino?.seccion }}
                        </span>
                        <div class="mt-1.5">
                            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md"
                                :class="obtenerValorArreglo(item.tradicion) === 'Original' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                {{ obtenerValorArreglo(item.tradicion) }}
                            </span>
                        </div>


                    </div>


                    <div class="w-full md:w-1/6 flex justify-between items-center md:justify-center mt-2 md:mt-0 gap-3">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estatus:</span>
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-full" :class="badgeColor(item.estatus)">
                                {{ item.estatus }}
                            </span>

                            <div v-if="item.estatus === 'Recepcionado'"
                                class="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
                                <button @click="abrirModalEditar(item)" title="Editar registro"
                                    class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                        </path>
                                    </svg>
                                </button>

                                <button @click="abrirModalCancelar(item)" title="Cancelar registro"
                                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div v-if="listaExpedientes.length === 0" class="text-center py-12 text-gray-500">
                Aún no hay registros capturados en Oficialía de Partes.
            </div>
        </div>

        <div
            :class="['fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6', modalAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
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
                    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 max-h-[90vh]">

                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex justify-between items-center shrink-0">
                        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
                            {{ isEditing ? 'Editar Registro de Oficialía' : 'Registrar y Turnar Documento' }}
                        </h2>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                    </div>

                    <div class="p-6 overflow-y-auto space-y-5">

                        <div
                            class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h3
                                class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                                1. Datos del Documento</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Número
                                        Consecutivo (Folio)</label>
                                    <input v-model="form.numero_consecutivo" type="text" placeholder="Ej: CJ-2026-001"
                                        required
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">No. de
                                        Fojas</label>
                                    <input v-model.number="form.fojas" type="number" min="1" required
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asunto</label>
                                    <textarea v-model="form.asunto" rows="2"
                                        placeholder="Descripción breve del oficio..." required
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"></textarea>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div
                                class="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300">2. Dependencias
                                    Involucradas</h3>
                                <button class="text-xs text-indigo-600 font-bold hover:underline"
                                    @click="abrirModalDependencia">+ Nueva Dependencia</button>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-3" v-if="dependenciasSeleccionadasInfo.length > 0">
                                <span v-for="dep in dependenciasSeleccionadasInfo" :key="dep.id"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-sm border border-indigo-200 dark:border-indigo-800">
                                    {{ dep.siglas || dep.nombre_oficial }}
                                    <button @click.prevent="removerDependencia(dep.id)"
                                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-white transition-colors">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </span>
                            </div>

                            <div class="relative mb-2">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input v-model="busquedaDependencia" type="text"
                                    placeholder="Buscar dependencia por nombre o siglas..."
                                    class="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-colors">
                            </div>

                            <div
                                class="max-h-40 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 shadow-inner">
                                <label v-for="dep in dependenciasFiltradas" :key="dep.id"
                                    class="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                                    <input type="checkbox" :value="dep.id" v-model="form.dependencias_ids"
                                        class="mt-0.5 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                                    <div class="flex flex-col">
                                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{
                                            dep.nombre_oficial }}</span>
                                        <span v-if="dep.siglas" class="text-[11px] font-bold text-gray-400 uppercase">{{
                                            dep.siglas }}</span>
                                    </div>
                                </label>
                                <div v-if="dependenciasFiltradas.length === 0"
                                    class="text-center py-6 text-sm text-gray-500">
                                    No se encontraron dependencias con "{{ busquedaDependencia }}"
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                            <h3
                                class="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-3 border-b border-indigo-200 dark:border-indigo-800/50 pb-2">
                                3. Área Destino (Consejería)
                            </h3>

                            <div v-if="!isEditing" class="space-y-2 max-h-48 overflow-y-auto">
                                <label v-for="sec in catalogoSecciones" :key="sec.id"
                                    class="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                    <input type="checkbox" :value="sec.id" v-model="form.areas_destino"
                                        class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                                    <span class="text-sm text-gray-700 dark:text-gray-200"><strong
                                            class="text-indigo-600 dark:text-indigo-400">{{ sec.codigo }}</strong> - {{
                                                sec.seccion }}</span>
                                </label>
                            </div>

                            <div v-else>
                                <select v-model="form.id_seccion_turnada"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                    <option v-for="sec in catalogoSecciones" :key="sec.id" :value="sec.id">
                                        {{ sec.codigo }} - {{ sec.seccion }}
                                    </option>
                                </select>
                                <p class="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-2">Al editar, solo
                                    puedes modificar el destino de esta copia en específico.</p>
                            </div>
                        </div>

                    </div>

                    <div
                        class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40 shrink-0">
                        <button @click="cerrarModal" :disabled="procesando"
                            class="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">Cancelar</button>
                        <button @click="isEditing ? ejecutarEdicion() : ejecutarTurnado()" :disabled="procesando"
                            class="px-6 py-2.5 text-sm bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transform transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                            <span v-if="procesando">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Procesando...
                            </span>
                            <span v-else>Registrar y Turnar</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>



        <div
            :class="['fixed inset-0 z-[60] flex items-center justify-center p-4', modalDependenciaAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
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
                        class="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex justify-between items-center">
                        <h2 class="text-base font-bold text-gray-800 dark:text-white">Nueva Dependencia</h2>
                        <button @click="cerrarModalDependencia"
                            class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-5 h-5" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg></button>
                    </div>

                    <div class="p-5 space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre Oficial <span
                                    class="text-red-500">*</span></label>
                            <input v-model="formDependencia.nombre_oficial" type="text"
                                placeholder="Ej: Secretaría de Salud"
                                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Siglas</label>
                                <input v-model="formDependencia.siglas" type="text" placeholder="Ej: SSG"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tipo</label>
                                <select v-model="formDependencia.tipo_ente"
                                    class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
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
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Titular /
                                Representante</label>
                            <input v-model="formDependencia.titular" type="text" placeholder="Nombre completo"
                                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>

                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalDependencia" :disabled="procesandoDependencia"
                            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
                        <button @click="guardarDependencia" :disabled="procesandoDependencia"
                            class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 flex items-center gap-2">
                            <span v-if="procesandoDependencia" class="animate-pulse">Guardando...</span>
                            <span v-else>Guardar</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>


        <div
            :class="['fixed inset-0 z-[70] flex items-center justify-center p-4', modalCancelarAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalCancelarAbierto" class="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    @click="cerrarModalCancelar"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95 translate-y-4"
                enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95 translate-y-4">
                <div v-if="modalCancelarAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-red-200 dark:border-red-900/50">

                    <div
                        class="px-5 py-4 border-b border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 flex gap-3 items-center">
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                            </path>
                        </svg>
                        <h2 class="text-base font-bold text-red-800 dark:text-red-300">Cancelar Registro</h2>
                    </div>

                    <div class="p-5 space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            Estás a punto de cancelar el folio <strong class="text-gray-900 dark:text-white">{{
                                folioACancelar }}</strong>.
                            Esta acción <span class="underline decoration-red-500 font-semibold">no eliminará</span> el
                            registro de la base de datos, pero lo retirará de las bandejas operativas.
                        </p>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Motivo de la
                                cancelación <span class="text-red-500">*</span></label>
                            <textarea v-model="motivoCancelacion" rows="3"
                                placeholder="Ej: Se capturó por duplicado, el folio correcto es..." required
                                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"></textarea>
                        </div>
                    </div>

                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalCancelar" :disabled="procesandoCancelacion"
                            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Abortar</button>
                        <button @click="ejecutarCancelacion"
                            :disabled="procesandoCancelacion || !motivoCancelacion.trim()"
                            class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                            <span v-if="procesandoCancelacion" class="animate-pulse">Procesando...</span>
                            <span v-else>Confirmar Cancelación</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

const toast = useToast()

// Estados y Catálogos
const listaExpedientes = ref([])
const catalogoSecciones = ref([])
const catalogoDependencias = ref([])
const idSeccionOficialia = ref(null)
const usuarioActual = ref(null)

const modalAbierto = ref(false)
const procesando = ref(false)

const busquedaDependencia = ref('')

// === MODAL SECUNDARIO: NUEVA DEPENDENCIA ===
const modalDependenciaAbierto = ref(false)
const procesandoDependencia = ref(false)

// === ESTADOS DE EDICIÓN ===
const isEditing = ref(false)
const editId = ref(null)

// === ESTADOS Y LÓGICA DE CANCELACIÓN (Soft Delete) ===
const modalCancelarAbierto = ref(false)
const procesandoCancelacion = ref(false)
const cancelarId = ref(null)
const folioACancelar = ref('')
const motivoCancelacion = ref('')

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

const formDependencia = ref({
    nombre_oficial: '',
    siglas: '',
    titular: '',
    tipo_ente: 'Estatal'
})

const abrirModalDependencia = () => {
    formDependencia.value = { nombre_oficial: '', siglas: '', titular: '', tipo_ente: 'Estatal' }
    modalDependenciaAbierto.value = true
}

const cerrarModalDependencia = () => {
    if (!procesandoDependencia.value) modalDependenciaAbierto.value = false
}

const guardarDependencia = async () => {
    formDependencia.value.nombre_oficial = formDependencia.value.nombre_oficial.trim()

    if (!formDependencia.value.nombre_oficial) {
        return toast.error("El nombre oficial es obligatorio.")
    }

    procesandoDependencia.value = true
    try {
        const { data, error } = await supabase
            .from('dependencias')
            .insert([{
                nombre_oficial: formDependencia.value.nombre_oficial,
                siglas: formDependencia.value.siglas.trim(),
                titular: formDependencia.value.titular.trim(),
                tipo_ente: formDependencia.value.tipo_ente
            }])
            .select()

        if (error) {
            if (error.code === '23505') throw new Error("Ya existe una dependencia con este nombre exacto.")
            throw error
        }

        toast.success("Dependencia registrada correctamente")

        // Agregamos el nuevo registro al catálogo en memoria
        if (data && data.length > 0) {
            catalogoDependencias.value.push(data[0])

            // Lo autoseleccionamos en el formulario principal
            if (!form.value.dependencias_ids.includes(data[0].id)) {
                form.value.dependencias_ids.push(data[0].id)
            }
        }

        // FIX: Forzamos el cierre directo del modal secundario
        modalDependenciaAbierto.value = false

    } catch (err) {
        toast.error(err.message || "Error al intentar guardar la dependencia.")
    } finally {
        procesandoDependencia.value = false
    }
}

// Formulario Inicial
const form = ref({
    numero_consecutivo: '',
    fojas: 1,
    asunto: '',
    dependencias_ids: [],
    areas_destino: [] // Array de UUIDs
})

// === CARGA INICIAL ===
// === CARGA INICIAL ===
const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('usuarios').select('id, rol, secciones_permitidas').eq('email', user.email).single()
    usuarioActual.value = userData.id

    // EL CÓDIGO MAESTRO DE OFICIALÍA
    const codigoOficialia = 'OFP'

    // FIX: Si es Admin, o si es Cliente con permiso OFP, SIEMPRE sacamos el ID de Oficialía
    if (userData.rol === 'admin' || (userData.secciones_permitidas && userData.secciones_permitidas.includes(codigoOficialia))) {
        const { data: sec } = await supabase.from('cuadro_general')
            .select('id')
            .eq('codigo', codigoOficialia)
            .single()

        idSeccionOficialia.value = sec?.id
    }

    // 2. Cargar Catálogos para el Modal
    const { data: dependencias } = await supabase.from('dependencias').select('id, nombre_oficial, siglas').eq('activo', true).order('nombre_oficial')
    catalogoDependencias.value = dependencias || []

    const { data: secciones } = await supabase
        .from('cuadro_general')
        .select('id, codigo, seccion')
        .neq('codigo', codigoOficialia)
        .order('codigo')

    catalogoSecciones.value = secciones || []

    // 3. Cargar tabla de expedientes creados ÚNICAMENTE por Oficialía
    if (idSeccionOficialia.value) {
        const { data: expedientes } = await supabase
            .from('expedientes')
            .select(`
                *,
                area_destino:id_seccion_turnada (codigo, seccion)
            `)
            .eq('id_seccion_registro', idSeccionOficialia.value)
            .order('fecha_registro', { ascending: false })
            .order('hora_registro', { ascending: false })

        listaExpedientes.value = expedientes || []
    }
}

// === GESTIÓN DEL MODAL ===

const abrirModalNuevo = () => {
    isEditing.value = false
    editId.value = null
    form.value = { numero_consecutivo: '', fojas: 1, asunto: '', dependencias_ids: [], areas_destino: [], id_seccion_turnada: null }
    modalAbierto.value = true
}

const abrirModalEditar = (item) => {
    isEditing.value = true
    editId.value = item.id

    // Poblamos el formulario con los datos de la fila
    form.value = {
        numero_consecutivo: item.numero_consecutivo,
        fojas: item.fojas,
        asunto: item.asunto,
        dependencias_ids: item.dependencias_ids || [],
        areas_destino: [], // No se usa en edición
        id_seccion_turnada: item.id_seccion_turnada
    }
    modalAbierto.value = true
}

const ejecutarEdicion = async () => {
    form.value.numero_consecutivo = form.value.numero_consecutivo.trim()
    if (!form.value.numero_consecutivo || !form.value.asunto) {
        return toast.error("El Folio y Asunto son obligatorios.")
    }

    procesando.value = true
    try {
        const { error } = await supabase
            .from('expedientes')
            .update({
                numero_consecutivo: form.value.numero_consecutivo,
                asunto: form.value.asunto.trim(),
                fojas: form.value.fojas,
                dependencias_ids: form.value.dependencias_ids,
                id_seccion_turnada: form.value.id_seccion_turnada,
                id_usuario_actualizacion: usuarioActual.value // Trazabilidad
            })
            .eq('id', editId.value)

        if (error) {
            if (error.code === '23505') throw new Error("Ese folio ya existe en el área destino seleccionada.")
            throw error
        }

        toast.success("Registro actualizado correctamente")
        await cargarDatos()
        modalAbierto.value = false

    } catch (err) {
        toast.error(err.message || "Error al actualizar el registro.")
    } finally {
        procesando.value = false
    }
}

const cerrarModal = () => {
    if (!procesando.value) modalAbierto.value = false
}

const abrirModalCancelar = (item) => {
    cancelarId.value = item.id
    folioACancelar.value = item.numero_consecutivo
    motivoCancelacion.value = ''
    modalCancelarAbierto.value = true
}

const cerrarModalCancelar = () => {
    if (!procesandoCancelacion.value) modalCancelarAbierto.value = false
}

const ejecutarCancelacion = async () => {
    motivoCancelacion.value = motivoCancelacion.value.trim()

    procesandoCancelacion.value = true
    try {
        // Formateamos la observación para que quede claro en la bitácora
        const notaJustificacion = `[CANCELADO DESDE OFICIALÍA]: ${motivoCancelacion.value}`

        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Cancelado', // Cambiamos el estatus
                observaciones: notaJustificacion, // Guardamos el motivo legal
                id_usuario_actualizacion: usuarioActual.value // Dejamos el rastro de quién fue
            })
            .eq('id', cancelarId.value)

        if (error) throw error

        toast.success(`Folio ${folioACancelar.value} cancelado exitosamente.`)
        await cargarDatos() // Recargamos la tabla
        modalCancelarAbierto.value = false

    } catch (err) {
        toast.error(err.message || "Error al intentar cancelar el registro.")
    } finally {
        procesandoCancelacion.value = false
    }
}

// === LA LÓGICA DE CLONACIÓN (BATCH INSERT) ===
const ejecutarTurnado = async () => {
    // Validaciones
    form.value.numero_consecutivo = form.value.numero_consecutivo.trim()
    if (!form.value.numero_consecutivo || !form.value.asunto) {
        return toast.error("El Folio y Asunto son obligatorios.")
    }
    if (form.value.areas_destino.length === 0) {
        return toast.error("Debes seleccionar al menos un área destino para turnar.")
    }

    procesando.value = true

    try {
        const batchInsertData = form.value.areas_destino.map((idDestino, index) => {
            return {
                numero_consecutivo: form.value.numero_consecutivo,
                asunto: form.value.asunto.trim(),
                fojas: form.value.fojas,
                dependencias_ids: form.value.dependencias_ids,
                id_seccion_registro: idSeccionOficialia.value,
                id_seccion_turnada: idDestino,
                id_usuario_registro: usuarioActual.value,
                estatus: 'Recepcionado',
                tradicion: index === 0 ? 'Original' : 'Copia',
            }
        })

        const { error } = await supabase
            .from('expedientes')
            .insert(batchInsertData)

        if (error) {
            if (error.code === '23505') {
                throw new Error(`El folio ${form.value.numero_consecutivo} ya fue turnado previamente a una de estas áreas.`)
            }
            throw error
        }

        toast.success(`Folio turnado con éxito a ${form.value.areas_destino.length} área(s)`)
        await cargarDatos()

        // FIX: Forzamos el cierre directo del modal principal
        modalAbierto.value = false

    } catch (err) {
        toast.error(err.message || "Ocurrió un error al intentar turnar el documento.")
    } finally {
        procesando.value = false
    }
}
// UTILIDAD PARA ARREGLOS DE BD (Soporte, Tradición, Condición)
const obtenerValorArreglo = (valor) => {
    if (!valor) return ''
    
    // Si es un arreglo nativo de JavaScript
    if (Array.isArray(valor)) return valor[0]
    
    // Si viene como string crudo desde la BD (ej. '["Original"]' o '{"Original"}')
    if (typeof valor === 'string') {
        // Limpieza con Expresión Regular: quita corchetes, llaves y comillas dobles
        return valor.replace(/[[\]"{}]/g, '').trim()
    }
    
    return valor
}

// === UTILIDADES VISUALES ===
const formatFecha = (fechaISO) => {
    if (!fechaISO) return ''
    const [year, month, day] = fechaISO.split('-')
    return `${day}/${month}/${year}`
}

const badgeColor = (estatus) => {
    switch (estatus) {
        case 'Recepcionado': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
        case 'En trámite':
        case 'Trabajado': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
        case 'Concluido': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
        case 'Cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800'
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
}

// Event Listeners (Accesibilidad)
const handleKeydown = (e) => {
    if (e.key === 'Escape') {
        // Primero verificamos si el modal secundario está abierto
        if (modalDependenciaAbierto.value && !procesandoDependencia.value) {
            cerrarModalDependencia()
        }
        // Si no, verificamos si el modal principal está abierto
        else if (modalAbierto.value && !procesando.value && !modalDependenciaAbierto.value) {
            cerrarModal()
        }
    }
}


onMounted(() => {
    cargarDatos()
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>