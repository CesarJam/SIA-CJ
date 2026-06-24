<template>
    <div class="fade-in relative min-h-screen pb-10">

        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">

            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Oficialía de Partes</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Recepción, captura y turnado de
                    correspondencia.</p>

                <div
                    class="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-fit border border-gray-200 dark:border-gray-700 shadow-inner mt-4">
                    <button @click="cambiarVista('entrada')"
                        :class="vistaActual === 'entrada' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-700 dark:text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                        class="px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
                            </path>
                        </svg>
                        Bandeja de Entrada
                    </button>
                    <button @click="cambiarVista('enviados')"
                        :class="vistaActual === 'enviados' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-700 dark:text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                        class="px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        Mis Enviados
                    </button>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select v-model="filtroAnio" @change="cargarDatos"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer font-bold">
                    <option v-for="anio in opcionesAnios" :key="anio" :value="anio">
                        Año {{ anio }}
                    </option>
                </select>

                <select v-model="filtroEstatus" @change="cargarDatos"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                    <option value="Todos">Todos los estatus</option>
                    <option value="Recepcionado">Recepcionado</option>
                    <option value="En trámite">En trámite</option>
                    <option value="Concluido">Concluido</option>
                    <option value="Cancelado">Cancelados</option>
                </select>

                <button @click="abrirModalNuevo"
                    class="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    + Nuevo Registro
                </button>
            </div>
        </div>

        <ModalRegistroDocumento v-model="modalRegistroAbierto" :origenId="idSeccionOficialia || ''"
            :datosEditar="expedienteAEditar" :esOficialia="true" @guardado="cargarDatos" />

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-[15%]">Folio / Fecha</div>
                <div class="w-[30%]">Asunto</div>
                <div class="w-[20%]">{{ vistaActual === 'entrada' ? 'Área Origen (Remitente)' : 'Área Turnada (Destino)'
                    }}</div>
                <div class="w-[20%]">Dependencias</div>
                <div class="w-[15%] text-center">Estatus / Acción</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-if="menuActivoId" @click="cerrarMenu" class="fixed inset-0 z-10"></div>

                <div v-for="(item, index) in expedientesPaginados" :key="item.id"
                    class="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-start gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20 last:rounded-b-xl"
                    :class="{
                        'bg-gray-50/50 dark:bg-gray-900/40': item.estatus === 'Concluido',
                        'relative z-20': menuActivoId === item.id,
                        'relative z-0': menuActivoId !== item.id,
                    }">
                    <div class="w-full md:w-[15%] flex flex-col md:block">
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.numero_consecutivo
                        }}</span><br>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatFecha(item.fecha_registro)
                        }}</span>
                    </div>

                    <div class="w-full md:w-[30%] flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Asunto:</span>
                        <span class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2" :title="item.asunto">{{
                            item.asunto }}</span>

                        <div class="mt-1.5">
                            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md"
                                :class="obtenerValorArreglo(item.tradicion) === 'Original' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                {{ obtenerValorArreglo(item.tradicion) }}
                            </span>
                        </div>
                    </div>

                    <div class="w-full md:w-[20%] flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">
                            {{ vistaActual === 'entrada' ? 'Origen:' : 'Destino:' }}
                        </span>

                        <span v-if="vistaActual === 'entrada'"
                            class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ item.area_origen?.codigo }} - {{ item.area_origen?.seccion }}
                        </span>
                        <span v-else class="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {{ item.area_destino?.codigo }} - {{ item.area_destino?.seccion }}
                        </span>
                    </div>

                    <!-- NUEVA COLUMNA: DEPENDENCIAS -->
                    <div class="w-full md:w-[20%] flex flex-col md:block mt-2 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">Dependencias:</span>
                        <div class="flex flex-wrap gap-1">
                            <template v-if="obtenerNombresDependencias(item.dependencias_ids).length > 0">
                                <span v-for="dep in obtenerNombresDependencias(item.dependencias_ids)" :key="dep.id"
                                    class="inline-block px-2 py-1 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50 max-w-full whitespace-normal break-words leading-tight"
                                    :title="dep.nombre_oficial">
                                    {{ dep.siglas ? `${dep.siglas} - ${dep.nombre_oficial}` : dep.nombre_oficial }}
                                </span>
                            </template>
                            <span v-else
                                class="text-[11px] text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">Ninguna</span>
                        </div>
                    </div>

                    <div
                        class="w-full md:w-[15%] flex justify-between items-center md:justify-center mt-3 md:mt-0 gap-3">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estatus:</span>
                        <div class="flex flex-col items-center gap-2 w-full">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-md w-full text-center"
                                :class="badgeColor(item.estatus)">
                                {{ item.estatus }}
                            </span>

                            <div class="relative w-full mt-2 z-50">
                                <button @click.stop="toggleMenu(item.id)"
                                    class="w-full px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm relative z-20">
                                    <span>Acciones</span>
                                    <svg class="w-3.5 h-3.5 transition-transform duration-200"
                                        :class="{ 'rotate-180': menuActivoId === item.id }" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                <!-- Menú Desplegable con Iconos y Reglas de Seguridad -->
                                <div v-if="menuActivoId === item.id"
                                    class="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-[9999] overflow-hidden flex flex-col"
                                    :class="index >= expedientesPaginados.length - 2 ? 'bottom-full mb-1 origin-bottom-right' : 'top-full mt-1 origin-top-right'">

                                    <!-- REGLA DE ORO: Si es un clon enviado a otra área, Oficialía SOLO PUEDE VER DETALLES -->
                                    <template
                                        v-if="vistaActual === 'enviados' && item.id_seccion_turnada !== idSeccionOficialia">
                                        <button @click="abrirModalDetalles(item); cerrarMenu();"
                                            class="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2.5 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                </path>
                                            </svg>
                                            Ver Seguimiento
                                        </button>
                                    </template>

                                    <!-- DE LO CONTRARIO, MOSTRAR MENÚ DE GESTIÓN (Para Acuses Locales y Bandeja de Entrada) -->
                                    <template v-else>
                                        <!-- Ver Detalles -->
                                        <button @click="abrirModalDetalles(item); cerrarMenu();"
                                            class="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2.5 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                </path>
                                            </svg>
                                            Ver Detalles
                                        </button>

                                        <!-- Asignar Trámite / Subir Archivo (Recepcionado y En trámite) -->
                                        <template
                                            v-if="item.estatus === 'Recepcionado' || item.estatus === 'En trámite'">
                                            <button @click="abrirModalAtender(item); cerrarMenu();"
                                                class="w-full text-left px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-50 dark:border-gray-700">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                </svg>
                                                {{ item.estatus === 'Recepcionado' ?
                                                    'Asignar / Subir Archivo' : 'Editar Asignación' }}
                                            </button>
                                        </template>

                                        <!-- Concluir Trámite (Solo En trámite) -->
                                        <button v-if="item.estatus === 'En trámite'"
                                            @click="abrirModalConfirmar(item); cerrarMenu();"
                                            class="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-50 dark:border-gray-700">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Concluir Trámite
                                        </button>

                                        <!-- Editar Registro (Solo Recepcionado) -->
                                        <button v-if="item.estatus === 'Recepcionado'"
                                            @click="abrirModalEditar(item); cerrarMenu();"
                                            class="w-full text-left px-4 py-2.5 text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-500 dark:hover:bg-amber-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-50 dark:border-gray-700">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                </path>
                                            </svg>
                                            Editar Registro
                                        </button>

                                        <!-- Correccio Administrativa -->
                                        <button
                                            v-if="rolUsuario === 'admin' && (item.estatus === 'Concluido' || item.estatus === 'Cancelado')"
                                            @click="abrirModalEdicionAdmin(item); cerrarMenu();"
                                            class="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-100 dark:border-gray-700/50">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                                </path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Corrección Administrativa
                                        </button>

                                        <!-- Cancelar Trámite (Solo Recepcionado) -->
                                        <button v-if="item.estatus === 'Recepcionado'"
                                            @click="abrirModalCancelar(item); cerrarMenu();"
                                            class="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-50 dark:border-gray-700">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                </path>
                                            </svg>
                                            Cancelar Trámite
                                        </button>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div v-if="totalPaginas > 1"
                class="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 gap-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando <span class="font-bold text-gray-900 dark:text-white">{{ ((paginaActual - 1) *
                        registrosPorPagina) + 1
                        }}</span> a
                    <span class="font-bold text-gray-900 dark:text-white">{{ Math.min(paginaActual * registrosPorPagina,
                        expedientesFiltrados.length) }}</span> de
                    <span class="font-bold text-gray-900 dark:text-white">{{ expedientesFiltrados.length }}</span>
                    registros
                </span>

                <div class="flex items-center gap-1">
                    <button @click="irAPagina(paginaActual - 1)" :disabled="paginaActual === 1"
                        class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                    <span class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Página {{
                        paginaActual }} de {{
                            totalPaginas }}</span>
                    <button @click="irAPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                        class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
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
                Cargando registros...
            </div>
            <div v-else-if="listaExpedientes.length === 0" class="text-center py-12 text-gray-500">
                Aún no hay registros capturados en Oficialía de Partes en este periodo.
            </div>
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

        <ModalAtender v-model="modalAtenderAbierto" :expediente="expedienteAAtender"
            :usuarioActual="usuarioActual || ''" @guardado="cargarDatos" />
        <ModalDetalles v-model="modalDetallesAbierto" :expediente="expedienteDetalle" />
        <ModalEdicionAdmin v-model="modalEdicionAdminAbierto" :expediente="expedienteAdmin"
            :catalogoSeries="catalogoSeriesEstructurado" :usuarioActual="usuarioActual || ''" @guardado="cargarDatos" />

        <div
            :class="['fixed inset-0 z-[80] flex items-center justify-center p-4', modalConfirmarAbierto ? 'pointer-events-auto' : 'pointer-events-none']">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalConfirmarAbierto" class="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    @click="cerrarModalConfirmar"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modalConfirmarAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div class="p-6 text-center">
                        <div
                            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                            <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">¿Concluir Expediente?</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Estás por concluir el folio <strong class="text-gray-900 dark:text-white">{{
                                expedienteAConcluir?.numero_consecutivo }}</strong>. Esta acción marcará el registro
                            como
                            concluido permanentemente.
                        </p>
                    </div>
                    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/40 flex justify-end gap-3">
                        <button @click="cerrarModalConfirmar"
                            class="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
                        <button @click="ejecutarConcluir" :disabled="procesando"
                            class="px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md transition-colors disabled:opacity-50">
                            {{ procesando ? 'Procesando...' : 'Confirmar Conclusión' }}
                        </button>
                    </div>
                </div>
            </transition>
        </div>



    </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from '@/composables/useToast'

import ModalRegistroDocumento from '@/components/ModalRegistroDocumento.vue'
import ModalAtender from '@/components/ModalAtender.vue'
import ModalDetalles from '@/components/ModalDetalles.vue'
import ModalEdicionAdmin from '@/components/ModalEdicionAdmin.vue'

const toast = useToast()

// === ESTADOS GLOBALES ===
const loading = ref(true)
const listaExpedientes = ref([])
const idSeccionOficialia = ref(null)
const usuarioActual = ref(null)
const vistaActual = ref("enviados"); // Oficialía es más de envío
const cambiarVista = async (nuevaVista) => {
    if (vistaActual.value === nuevaVista) return;
    vistaActual.value = nuevaVista;
    filtroEstatus.value = "Todos";
    paginaActual.value = 1;
    await cargarDatos();
};

// === ESTADOS DEL MENÚ DESPLEGABLE (ACCIONES) ===
const menuActivoId = ref(null);

const toggleMenu = (id) => {
    menuActivoId.value = menuActivoId.value === id ? null : id;
};

const cerrarMenu = () => {
    menuActivoId.value = null;
};

// === ESTADOS DE PAGINACIÓN ===
const paginaActual = ref(1);
const registrosPorPagina = 100;


// === FILTROS ===
const anioActual = new Date().getFullYear()
const opcionesAnios = ref(Array.from({ length: 8 }, (_, i) => anioActual - i))
const filtroAnio = ref(anioActual)
const filtroEstatus = ref("Todos")

// === ESTADOS MODAL REGISTRO ===
const modalRegistroAbierto = ref(false)
const expedienteAEditar = ref(null)

// === ESTADOS MODAL DETALLES ===
const modalDetallesAbierto = ref(false)
const expedienteDetalle = ref(null)
const abrirModalDetalles = (item) => {
    expedienteDetalle.value = item
    modalDetallesAbierto.value = true
}

// === ESTADOS PARA MODAL DE CONFIRMACIÓN ===
const modalConfirmarAbierto = ref(false);
const expedienteAConcluir = ref(null);
const procesando = ref(false);

const abrirModalConfirmar = (item) => {
    expedienteAConcluir.value = item;
    modalConfirmarAbierto.value = true;
};

const cerrarModalConfirmar = () => {
    if (!procesando.value) modalConfirmarAbierto.value = false;
};

const ejecutarConcluir = async () => {
    procesando.value = true;
    try {
        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Concluido',
                id_usuario_actualizacion: usuarioActual.value
            })
            .eq('id', expedienteAConcluir.value.id);

        if (error) throw error;

        toast.success("Expediente concluido correctamente.");
        await cargarDatos();
    } catch (err) {
        toast.error("Error al concluir el expediente.");
    } finally {
        // PRIMERO apagamos el estado de procesando
        procesando.value = false;
        // LUEGO mandamos a cerrar el modal
        cerrarModalConfirmar();
    }
};



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


// === CARGA INICIAL Y FILTRADA ===
const cargarDatos = async () => {
    loading.value = true

    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: userData } = await supabase.from('usuarios').select('id, rol, secciones_permitidas').eq('email', user.email).single()
        usuarioActual.value = userData.id
        rolUsuario.value = userData.rol // <--- AHORA GUARDAMOS EL ROL

        const codigoOficialia = 'OFP'

        if (userData.rol === 'admin' || (userData.secciones_permitidas && userData.secciones_permitidas.includes(codigoOficialia))) {
            const { data: sec } = await supabase.from('cuadro_general')
                .select('id')
                .eq('codigo', codigoOficialia)
                .single()

            idSeccionOficialia.value = sec?.id
        }

        if (idSeccionOficialia.value) {
            // === CARGAR SERIES PARA EL MODAL ADMIN ===
            const { data: seriesDB } = await supabase
                .from("series")
                .select("id, codigo_serie, nombre, subseries")
                .eq("id_seccion", idSeccionOficialia.value)
                .order("codigo_serie");

            let structuredData = [];
            if (seriesDB) {
                seriesDB.forEach((seriePadre) => {
                    if (seriePadre.subseries && Array.isArray(seriePadre.subseries)) {
                        let subseriesWithParentInfo = seriePadre.subseries.map((sub) => ({
                            ...sub,
                            id_serie_padre: seriePadre.id,
                            codigo_serie_padre: seriePadre.codigo_serie,
                            nombre_serie_padre: seriePadre.nombre,
                        }));
                        structuredData.push({
                            id: seriePadre.id,
                            codigo_serie: seriePadre.codigo_serie,
                            nombre: seriePadre.nombre,
                            subseries: subseriesWithParentInfo,
                        });
                    }
                });
            }
            catalogoSeriesEstructurado.value = structuredData;

            // === CARGAR EXPEDIENTES ===
            let query = supabase
                .from('expedientes')
                .select(`*, area_destino:id_seccion_turnada (codigo, seccion), area_origen:id_seccion_registro (codigo, seccion)`)
                .gte("fecha_registro", `${filtroAnio.value}-01-01`)
                .lte("fecha_registro", `${filtroAnio.value}-12-31`)
                .order('fecha_registro', { ascending: false })
                .order('hora_registro', { ascending: false })

            if (vistaActual.value === "entrada") {
                query = query
                    .eq('id_seccion_turnada', idSeccionOficialia.value)
                    .or(`id_seccion_registro.neq.${idSeccionOficialia.value},tipo_registro.eq.Recibido`);
            } else {
                query = query
                    .eq('id_seccion_registro', idSeccionOficialia.value)
                    .or(`id_seccion_turnada.neq.${idSeccionOficialia.value},tipo_registro.eq.Enviado`);
            }

            const { data: expedientes, error } = await query
            if (error) throw error
            listaExpedientes.value = expedientes || []
        }
    } catch (error) {
        console.error("Error al cargar datos de Oficialía:", error)
        toast.error("Error al cargar los registros.")
    } finally {
        loading.value = false
    }
}

// === GESTIÓN DEL MODAL ===

const abrirModalNuevo = () => {
    expedienteAEditar.value = null // Null significa "Modo Creación"
    modalRegistroAbierto.value = true
}

const abrirModalEditar = (item) => {
    expedienteAEditar.value = item // Le pasamos la fila completa para "Modo Edición"
    modalRegistroAbierto.value = true
}

// === LÓGICA DE CANCELACIÓN ===
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
        const notaJustificacion = `[CANCELADO DESDE OFICIALÍA]: ${motivoCancelacion.value}`

        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Cancelado',
                observaciones: notaJustificacion,
                id_usuario_actualizacion: usuarioActual.value
            })
            .eq('id', cancelarId.value)

        if (error) throw error

        toast.success(`Folio ${folioACancelar.value} cancelado exitosamente.`)
        await cargarDatos()
        modalCancelarAbierto.value = false

    } catch (err) {
        toast.error(err.message || "Error al intentar cancelar el registro.")
    } finally {
        procesandoCancelacion.value = false
    }
}

watch([filtroEstatus, filtroAnio, vistaActual], () => {
    paginaActual.value = 1;
});

const expedientesFiltrados = computed(() => {
    if (filtroEstatus.value === "Todos") return listaExpedientes.value;
    return listaExpedientes.value.filter(exp => exp.estatus === filtroEstatus.value);
});

const totalPaginas = computed(() => {
    return Math.ceil(expedientesFiltrados.value.length / registrosPorPagina) || 1;
});

const expedientesPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    return expedientesFiltrados.value.slice(inicio, fin);
});

const irAPagina = (pag) => {
    if (pag >= 1 && pag <= totalPaginas.value) {
        paginaActual.value = pag;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// === ESTADOS MODAL ATENDER ===
const modalAtenderAbierto = ref(false)
const expedienteAAtender = ref(null)

const abrirModalAtender = (item) => {
    expedienteAAtender.value = item
    modalAtenderAbierto.value = true
}

const concluirExpediente = async (item) => {
    if (!confirm(`¿Estás seguro de concluir el folio ${item.numero_consecutivo}?`)) return;

    try {
        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Concluido',
                id_usuario_actualizacion: usuarioActual.value
            })
            .eq('id', item.id);

        if (error) throw error;
        toast.success("Expediente concluido correctamente.");
        await cargarDatos();
    } catch (err) {
        toast.error("Error al concluir el expediente.");
    }
};

// === CATÁLOGO GLOBAL DE DEPENDENCIAS ===
const catalogoDependenciasGlobal = ref([]);

const cargarCatalogoDependenciasGlobal = async () => {
    try {
        const { data, error } = await supabase.from('dependencias').select('id, nombre_oficial, siglas');
        if (!error && data) {
            catalogoDependenciasGlobal.value = data;
        }
    } catch (err) {
        console.error("Error al cargar dependencias globales:", err);
    }
};

const obtenerNombresDependencias = (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
    return catalogoDependenciasGlobal.value.filter(dep => ids.includes(dep.id));
};

const rolUsuario = ref(null); // Para saber si es admin
const catalogoSeriesEstructurado = ref([]); // Requerido por el modal admin

// === ESTADOS MODAL EDICIÓN ADMIN ===
const modalEdicionAdminAbierto = ref(false);
const expedienteAdmin = ref(null);

const abrirModalEdicionAdmin = (item) => {
    expedienteAdmin.value = item;
    modalEdicionAdminAbierto.value = true;
};

// === UTILIDADES VISUALES ===

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
        case 'Concluido': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600'
        case 'Cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800'
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
}

// Event Listeners (Accesibilidad)

// === ACCESIBILIDAD (TECLADO) ===
const handleKeydown = (e) => {
    if (e.key === 'Escape') {
        // Si el modal de cancelación está abierto, lo cierra
        if (modalCancelarAbierto.value && !procesandoCancelacion.value) {
            cerrarModalCancelar();
        }
        // NUEVO: Si el modal de confirmación de concluir está abierto, lo cierra
        else if (modalConfirmarAbierto.value && !procesando.value) {
            cerrarModalConfirmar();
        }
    }
};


onMounted(async () => {
    await cargarCatalogoDependenciasGlobal()
    cargarDatos()
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>