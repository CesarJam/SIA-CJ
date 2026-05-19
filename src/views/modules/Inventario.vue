<template>
    <div class="fade-in relative min-h-screen pb-10">
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                    Inventario Documental
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                    Bandeja de entrada y gestor de tareas del área:
                    <strong class="text-indigo-600 dark:text-indigo-400">{{ miSeccion?.codigo }}</strong>
                </p>

                <div
                    class="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-fit border border-gray-200 dark:border-gray-700 shadow-inner">
                    <button @click="cambiarVista('entrada')"
                        :class="vistaActual === 'entrada' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400 font-bold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                        class="px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
                            </path>
                        </svg>
                        Bandeja de Entrada
                    </button>
                    <button @click="cambiarVista('enviados')"
                        :class="vistaActual === 'enviados' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400 font-bold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
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
                <select v-model="seccionSeleccionada" @change="cargarBandeja"
                    class="w-full md:w-auto truncate max-w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer">
                    <option v-for="area in areasUsuario" :key="area.id" :value="area.id">
                        {{ area.codigo }} - {{ area.seccion }}
                    </option>
                </select>

                <select v-model="filtroEstatus"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer">
                    <option value="Todos">Todos los estatus</option>
                    <option value="Recepcionado">Recepcionado (Nuevos)</option>
                    <option value="En trámite">En trámite</option>
                    <option value="Concluido">Concluido (Archivados)</option>
                    <option value="Cancelado">Cancelados</option>
                </select>

                <button @click="abrirModalNuevoInterno"
                    class="w-full md:w-auto px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Nuevo Registro Interno
                </button>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-1/6">Folio / Fecha</div>
                <div class="w-1/3">Asunto y Seguimiento</div>
                <div class="w-1/4">{{ vistaActual === 'entrada' ? 'Origen (Remitente)' : 'Destino (Turnado a)' }}</div>
                <div class="w-1/6 text-center">Estatus / Acción</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-if="menuActivoId" @click="cerrarMenu" class="fixed inset-0 z-10"></div>
                <div v-for="(item, index) in expedientesFiltrados" :key="item.id"
                    class="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-start gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20 last:rounded-b-xl"
                    :class="{
                        'opacity-75 bg-gray-50/50 dark:bg-gray-900/20':
                            item.estatus === 'Concluido',
                        'relative z-20': menuActivoId === item.id,
                        'relative z-0': menuActivoId !== item.id,
                    }">
                    <div class="w-full md:w-1/6 flex flex-col md:block">
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.numero_consecutivo
                        }}</span>
                        <span v-if="item.caracter === 'Urgente' || item.caracter === 'Extraordinario'"
                            class="ml-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800 mb-0.5">
                            {{ item.caracter }}
                        </span>
                        <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {{ formatFecha(item.fecha_registro) }}
                        </div>
                    </div>

                    <div class="w-full md:w-1/3 flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Asunto:</span>
                        <span class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2" :title="item.asunto">{{
                            item.asunto }}</span>

                        <div v-if="item.responsable_tramite"
                            class="mt-2 flex items-start gap-1.5 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                            <svg class="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <div class="flex flex-col">
                                <span class="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Responsable: {{
                                    item.responsable_tramite }}</span>
                                <span v-if="item.indicaciones_tramite"
                                    class="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 italic mt-0.5 line-clamp-1"
                                    :title="item.indicaciones_tramite">"{{ item.indicaciones_tramite }}"</span>
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-1/4 flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">
                            {{ vistaActual === 'entrada' ? 'Origen:' : 'Destino:' }}
                        </span>

                        <span v-if="vistaActual === 'entrada'"
                            class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ item.area_origen?.codigo || "Externo" }} - {{ item.area_origen?.seccion || "No definido"
                            }}
                        </span>
                        <span v-else class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {{ item.area_destino?.codigo }} - {{ item.area_destino?.seccion }}
                        </span>

                        <div class="mt-1.5">
                            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md"
                                :class="obtenerValorArreglo(item.tradicion) === 'Original' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                {{ obtenerValorArreglo(item.tradicion) }}
                            </span>
                        </div>
                    </div>

                    <div class="w-full md:w-1/6 flex justify-between items-center md:justify-center mt-3 md:mt-0 gap-3">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estatus:</span>

                        <div class="flex flex-col items-center gap-2 w-full">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-full w-full text-center"
                                :class="badgeColor(item.estatus)">
                                {{ item.estatus }}
                            </span>

                            <div class="relative w-full mt-2">
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

                                <transition enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95">
                                    <div v-if="menuActivoId === item.id"
                                        class="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-30 overflow-hidden flex flex-col"
                                        :class="expedientesFiltrados.length > 3 &&
                                            index >= expedientesFiltrados.length - 2
                                            ? 'bottom-full mb-1 origin-bottom-right'
                                            : 'top-full mt-1 origin-top-right'
                                            ">
                                        <template
                                            v-if="vistaActual === 'enviados' && item.id_seccion_turnada !== seccionSeleccionada">
                                            <button @click="
                                                abrirModalDetalles(item);
                                            cerrarMenu();
                                            "
                                                class="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2.5 transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                    </path>
                                                </svg>
                                                Ver Detalles
                                            </button>
                                        </template>


                                        <template v-else>
                                            <template v-if="item.estatus === 'Recepcionado'">
                                                <button @click="
                                                    abrirModalAtender(item);
                                                cerrarMenu();
                                                "
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 flex items-center gap-2.5 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                    </svg>
                                                    Asignar Trámite
                                                </button>
                                                <button @click="
                                                    abrirModalDetalles(item);
                                                cerrarMenu();
                                                "
                                                    class="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2.5 transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                                        </path>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                        </path>
                                                    </svg>
                                                    Ver Detalles
                                                </button>

                                            </template>

                                            <template v-if="item.estatus === 'En trámite'">

                                                <button @click="
                                                    abrirModalConcluir(item);
                                                cerrarMenu();
                                                "
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 flex items-center gap-2.5 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Clasificar y Concluir
                                                </button>
                                                <button @click="
                                                    abrirModalAtender(item);
                                                cerrarMenu();
                                                "
                                                    class="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2.5 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                                        </path>
                                                    </svg>
                                                    Editar Asignación
                                                </button>

                                                <button @click="
                                                    abrirModalDetalles(item);
                                                cerrarMenu();
                                                "
                                                    class="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2.5 transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                                        </path>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                        </path>
                                                    </svg>
                                                    Ver Detalles
                                                </button>


                                            </template>

                                            <template v-if="item.estatus === 'Concluido'">
                                                <button @click="abrirModalDetalles(item); cerrarMenu();"
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 flex items-center gap-2.5 transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                                        </path>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                        </path>
                                                    </svg>
                                                    Auditar Expediente
                                                </button>
                                            </template>

                                            <template v-if="item.estatus === 'Cancelado'">
                                                <button @click="abrirModalDetalles(item); cerrarMenu();"
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                                        </path>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                        </path>
                                                    </svg>
                                                    Ver Motivo de Cancelación
                                                </button>
                                            </template>
                                            <button
                                                v-if="item.id_seccion_registro === item.id_seccion_turnada && item.estatus !== 'Concluido' && item.estatus !== 'Cancelado' && item.estatus !== 'En trámite'"
                                                @click="abrirModalCancelar(item); cerrarMenu();"
                                                class="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-100 dark:border-gray-700">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                    </path>
                                                </svg>
                                                Cancelar Trámite
                                            </button>

                                        </template>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="text-center py-12 text-gray-500 flex flex-col items-center">
                <svg class="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Cargando inventario...
            </div>
            <div v-else-if="expedientesFiltrados.length === 0" class="text-center py-12 text-gray-500">
                No se encontraron expedientes en esta bandeja.
            </div>
        </div>

        <div :class="[
            'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',
            modalAtenderAbierto ? 'pointer-events-auto' : 'pointer-events-none',
        ]">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalAtenderAbierto" class="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    @click="cerrarModalAtender"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modalAtenderAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-blue-200 dark:border-blue-900/50">
                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-blue-800 dark:text-blue-400">
                            Asignar Trámite y Datos Físicos
                        </h2>
                        <button @click="cerrarModalAtender" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto space-y-6 max-h-[70vh]">
                        <div
                            class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h3
                                class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                                1. Control de Tareas
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Responsable
                                        del
                                        Trámite
                                        <span class="text-red-500">*</span></label>
                                    <input v-model="formAtender.responsable_tramite" type="text"
                                        placeholder="Ej: Lic. Arturo Jiménez" required
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Indicaciones /
                                        Observaciones de la asignación</label>
                                    <textarea v-model="formAtender.indicaciones_tramite" rows="2"
                                        placeholder="Ej: Responder oficio antes del viernes. Se reasignó por carga de trabajo."
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                            <h3
                                class="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-3 border-b border-indigo-200 dark:border-indigo-800/50 pb-2">
                                2. Naturaleza Física (Pre-CADIDO)
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tradición
                                        Documental</label>
                                    <select v-model="formAtender.tradicion"
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                                        <option value="Original">Original</option>
                                        <option value="Copia">Copia</option>
                                        <option value="Electrónico">Electrónico</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Soporte</label>
                                    <select v-model="formAtender.soporte"
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                                        <option value="Papel">Papel</option>
                                        <option value="Óptico">Óptico (CD/DVD)</option>
                                        <option value="Digital">Digital / Nube</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Condición de
                                        Acceso</label>
                                    <select v-model="formAtender.condicion_acceso"
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                                        <option value="Pública">Pública</option>
                                        <option value="Reservada">Reservada</option>
                                        <option value="Confidencial">Confidencial</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Inmueble
                                        (Gaveta)</label>
                                    <input v-model="formAtender.inmueble" type="text"
                                        placeholder="Ej: Archivo de Trámite"
                                        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div
                                    class="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <h3
                                        class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
                                        <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                            </path>
                                        </svg>
                                        3. Archivos Digitales (Anexos)
                                    </h3>
                                    <GestorDocumental v-if="expedienteAAtender" :expedienteId="expedienteAAtender.id"
                                        :folio="expedienteAAtender.numero_consecutivo" modo="escritura" />
                                </div>

                            </div>

                        </div>
                    </div>

                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalAtender" :disabled="procesando"
                            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button @click="ejecutarAtencion"
                            :disabled="procesando || !formAtender.responsable_tramite.trim()"
                            class="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                            <span v-if="procesando" class="animate-pulse">Guardando...</span>
                            <span v-else>Guardar y Comenzar Trámite</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <div :class="[
            'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',
            modalConcluirAbierto ? 'pointer-events-auto' : 'pointer-events-none',
        ]">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalConcluirAbierto" class="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    @click="cerrarModalConcluir"></div>
            </transition>

            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modalConcluirAbierto"
                    class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-emerald-200 dark:border-emerald-900/50">
                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                            Clasificación Archivística Final
                        </h2>
                        <button @click="cerrarModalConcluir"
                            class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto space-y-5 max-h-[70vh]">
                        <div
                            class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-800 dark:text-emerald-300 mb-4 flex gap-3 items-center">
                            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p>
                                El trámite de
                                <strong>{{ expedienteAConcluir?.numero_consecutivo }}</strong>
                                ha finalizado. Clasifica el fondo del asunto para cerrarlo y
                                generar su Snapshot histórico.
                            </p>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Subserie
                                Documental
                                <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                        </path>
                                    </svg>
                                </div>
                                <select v-model="codigoSubserieConcluir" required
                                    class="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 appearance-none">
                                    <option value="" disabled>
                                        Selecciona la clasificación intelectual...
                                    </option>

                                    <optgroup v-for="serie in catalogoSeriesEstructurado" :key="serie.id"
                                        :label="`${serie.codigo_serie} - ${serie.nombre}`"
                                        class="font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 text-xs">
                                        <option v-for="sub in serie.subseries" :key="sub.codigoSubserie"
                                            :value="sub.codigoSubserie"
                                            class="font-normal text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 text-sm pl-4">
                                            {{ sub.codigoSubserie }} - {{ sub.nombre }}
                                        </option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        <div v-if="detalleSerieSeleccionada"
                            class="mt-4 p-4 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <h4 class="text-xs font-bold text-gray-400 uppercase mb-3">
                                Previsualización del Snapshot Histórico
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label
                                        class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Cód.
                                        Padre</label>
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {{ detalleSerieSeleccionada.codigo_serie_padre }}
                                    </div>
                                </div>
                                <div class="md:col-span-2">
                                    <label
                                        class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Nombre
                                        Subserie</label>
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                        {{ detalleSerieSeleccionada.nombre }}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Valor</label>
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {{ detalleSerieSeleccionada.valor_documental }}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Años
                                        Trámite</label>
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {{ detalleSerieSeleccionada.at }}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        class="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Años
                                        Concentración</label>
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {{ detalleSerieSeleccionada.ac }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalConcluir" :disabled="procesando"
                            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button @click="ejecutarConclusion" :disabled="procesando || !codigoSubserieConcluir"
                            class="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg font-bold shadow-md hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 transition-colors">
                            <span v-if="procesando" class="animate-pulse">Archivando...</span>
                            <span v-else>Confirmar y Archivar</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <div :class="[
            'fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6',
            modalDetallesAbierto ? 'pointer-events-auto' : 'pointer-events-none',
        ]">
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="modalDetallesAbierto" class="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    @click="cerrarModalDetalles"></div>
            </transition>

            <!--Modal detalle-->
            <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="modalDetallesAbierto"
                    class="relative bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 h-[85vh]">
                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center shrink-0">
                        <div class="flex items-center gap-3">
                            <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                                Expediente: {{ expedienteDetalle?.numero_consecutivo }}
                            </h2>
                            <span class="px-2.5 py-1 text-xs font-bold rounded-full"
                                :class="badgeColor(expedienteDetalle?.estatus)">
                                {{ expedienteDetalle?.estatus }}
                            </span>
                        </div>
                        <button @click="cerrarModalDetalles"
                            class="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-1.5 rounded-full">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <div v-if="expedienteDetalle?.estatus === 'Cancelado'"
                        class="px-6 py-4 bg-red-50 border-b border-red-100 dark:bg-red-900/20 dark:border-red-800/30 flex items-start gap-3 shrink-0">
                        <svg class="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                            </path>
                        </svg>
                        <div>
                            <h4 class="text-sm font-bold text-red-800 dark:text-red-300">Motivo de Cancelación</h4>
                            <p class="text-sm text-red-600 dark:text-red-400 mt-1 font-medium">
                                {{ expedienteDetalle?.observaciones || 'No se especificó motivo en el sistema.' }}
                            </p>
                        </div>
                    </div>

                    <div class="p-6 overflow-y-auto flex-1 space-y-6">
                        <div
                            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3
                                class="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Información General
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <span class="block text-[11px] font-bold text-gray-500 uppercase">Asunto</span>
                                    <p class="text-sm text-gray-800 dark:text-gray-200">
                                        {{ expedienteDetalle?.asunto }}
                                    </p>
                                </div>
                                <div>
                                    <span class="block text-[11px] font-bold text-gray-500 uppercase">Origen</span>
                                    <p class="text-sm text-gray-800 dark:text-gray-200">
                                        {{ expedienteDetalle?.area_origen?.codigo }} -
                                        {{ expedienteDetalle?.area_origen?.seccion }}
                                    </p>
                                </div>
                                <div>
                                    <span class="block text-[11px] font-bold text-gray-500 uppercase">Responsable
                                        Actual</span>
                                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {{
                                            expedienteDetalle?.responsable_tramite || "Sin asignar"
                                        }}
                                    </p>
                                </div>
                                <div>
                                    <span
                                        class="block text-[11px] font-bold text-gray-500 uppercase">Indicaciones</span>
                                    <p class="text-sm text-gray-800 dark:text-gray-200 italic">
                                        {{ expedienteDetalle?.indicaciones_tramite || "Ninguna" }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3
                                class="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4">
                                    </path>
                                </svg>
                                Datos de Archivo (CADIDO)
                            </h3>

                            <div
                                class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div>
                                    <span
                                        class="block text-[10px] font-bold text-gray-500 uppercase">Tradición</span><span
                                        class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{
                                            obtenerValorArreglo(expedienteDetalle?.tradicion)
                                        }}</span>
                                </div>
                                <div>
                                    <span
                                        class="block text-[10px] font-bold text-gray-500 uppercase">Soporte</span><span
                                        class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{
                                            obtenerValorArreglo(expedienteDetalle?.soporte) }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-500 uppercase">Acceso</span><span
                                        class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{
                                            obtenerValorArreglo(expedienteDetalle?.condicion_acceso)
                                        }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-500 uppercase">Inmueble /
                                        Gaveta</span><span class="text-xs text-gray-800 dark:text-gray-200">{{
                                            expedienteDetalle?.inmueble || "No definido"
                                        }}</span>
                                </div>
                            </div>

                            <div v-if="expedienteDetalle?.snapshot_cadido"
                                class="bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div class="md:col-span-2">
                                        <span
                                            class="block text-[10px] font-bold text-emerald-600 uppercase">Subserie</span><span
                                            class="text-sm font-bold text-gray-800 dark:text-gray-200">{{
                                                expedienteDetalle.snapshot_cadido.codigo_subserie }} -
                                            {{
                                                expedienteDetalle.snapshot_cadido.nombre_subserie
                                            }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-[10px] font-bold text-emerald-600 uppercase">Valor
                                            Documental</span><span class="text-sm text-gray-800 dark:text-gray-200">{{
                                                expedienteDetalle.snapshot_cadido.valor_documental
                                            }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-[10px] font-bold text-emerald-600 uppercase">Años
                                            Trámite</span><span
                                            class="text-sm font-bold text-gray-800 dark:text-gray-200">{{
                                                expedienteDetalle.snapshot_cadido.anios_tramite
                                            }}</span>
                                    </div>
                                    <div class="md:col-span-2">
                                        <span class="block text-[10px] font-bold text-emerald-600 uppercase">Años
                                            Concentración</span><span
                                            class="text-sm font-bold text-gray-800 dark:text-gray-200">{{
                                                expedienteDetalle.snapshot_cadido.anios_concentracion
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-2 text-xs text-gray-400 italic">
                                Clasificación intelectual pendiente (Se definirá al concluir).
                            </div>

                            <div class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h4 class="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    Documentos Digitales Anexos
                                </h4>
                                
                                <GestorDocumental 
                                    v-if="expedienteDetalle" 
                                    :expedienteId="expedienteDetalle.id" 
                                    :folio="expedienteDetalle.numero_consecutivo" 
                                    modo="lectura"
                                />
                            </div>
                        </div>

                        <div
                            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Trazabilidad (Línea de Tiempo)
                            </h3>

                            <div v-if="loadingBitacora" class="flex justify-center py-6 text-indigo-500">
                                <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4">
                                    </circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            </div>
                            <div v-else-if="historialBitacora.length === 0"
                                class="text-center py-4 text-xs text-gray-400">
                                No se encontraron registros en la bitácora para este expediente.
                            </div>
                            <div v-else
                                class="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6 pb-2">
                                <div v-for="(mov, idx) in historialBitacora" :key="idx" class="relative pl-6">
                                    <div
                                        class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-indigo-500 shadow-sm">
                                    </div>

                                    <div
                                        class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                {{ mov.accion || "Actualización de Estatus" }}
                                            </h4>

                                            <span v-if="mov.usuario"
                                                class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                                    </path>
                                                </svg>
                                                {{ mov.usuario.nombre || 'Desconocido' }} /
                                                {{ mov.usuario.email || 'Desconocido' }}
                                            </span>
                                        </div>

                                        <time class="text-[11px] font-bold text-gray-400 whitespace-nowrap">
                                            {{ formatFechaHora(mov.fecha_hora) }}
                                        </time>
                                    </div>

                                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                        <span class="font-semibold text-gray-700 dark:text-gray-300">Estatus:
                                        </span>
                                        <span :class="badgeColor(
                                            mov.detalles?.estatus_nuevo ||
                                            mov.detalles?.estatus_inicial ||
                                            'Recepcionado',
                                        )
                                            " class="px-1.5 py-0.5 rounded ml-1 border">
                                            {{
                                                mov.detalles?.estatus_nuevo ||
                                                mov.detalles?.estatus_inicial ||
                                                "Recepcionado"
                                            }}
                                        </span>
                                    </div>


                                </div>
                            </div>
                        </div>
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
                        <h2 class="text-base font-bold text-red-800 dark:text-red-300">Cancelar Registro Local</h2>
                    </div>
                    <div class="p-5 space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            Estás a punto de cancelar el folio <strong class="text-gray-900 dark:text-white">{{
                                folioACancelar
                            }}</strong>.
                        </p>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Motivo de la
                                cancelación <span class="text-red-500">*</span></label>
                            <textarea v-model="motivoCancelacion" rows="3" placeholder="Justificación obligatoria..."
                                required
                                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-colors"></textarea>
                        </div>
                    </div>
                    <div
                        class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/40">
                        <button @click="cerrarModalCancelar" :disabled="procesandoCancelacion"
                            class="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">Abortar</button>
                        <button @click="ejecutarCancelacion"
                            :disabled="procesandoCancelacion || !motivoCancelacion.trim()"
                            class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50">
                            <span v-if="procesandoCancelacion" class="animate-pulse">Procesando...</span>
                            <span v-else>Confirmar Cancelación</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <ModalRegistroDocumento v-model="modalNuevoAbierto" :origenId="seccionSeleccionada || ''"
            titulo="Nuevo Oficio Interno" @registro-exitoso="onRegistroInternoExitoso" />
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase";
import { useToast } from "@/composables/useToast";
import ModalRegistroDocumento from '@/components/ModalRegistroDocumento.vue';
import GestorDocumental from '@/components/GestorDocumental.vue';

const toast = useToast();

const modalNuevoAbierto = ref(false);

// === ESTADOS GLOBALES ===
const loading = ref(true);
const procesando = ref(false);
const listaExpedientes = ref([]);
const usuarioActual = ref(null);

const areasUsuario = ref([]);
const seccionSeleccionada = ref(null);
const miSeccion = ref(null);
const filtroEstatus = ref("Todos");
const vistaActual = ref("entrada"); // 'entrada' | 'enviados'

const cambiarVista = async (nuevaVista) => {
    if (vistaActual.value === nuevaVista) return;
    vistaActual.value = nuevaVista;
    filtroEstatus.value = "Todos"; // Limpiamos el filtro por comodidad
    await cargarBandeja();
};

// === ESTADOS DEL MENÚ DESPLEGABLE (ACCIONES) ===
const menuActivoId = ref(null);

const toggleMenu = (id) => {
    // Si el menú ya está abierto, lo cierra. Si no, abre el de este ID.
    menuActivoId.value = menuActivoId.value === id ? null : id;
};

const cerrarMenu = () => {
    menuActivoId.value = null;
};

// === ESTADOS MODAL 1: ATENDER ===
const modalAtenderAbierto = ref(false);
const expedienteAAtender = ref(null);
const formAtender = ref({
    responsable_tramite: "",
    indicaciones_tramite: "",
    tradicion: "Original",
    soporte: "Papel",
    condicion_acceso: "Pública",
    inmueble: "",
    ubicacion_url: "",
});

// === ESTADOS MODAL 2: CONCLUIR ===
const modalConcluirAbierto = ref(false);
const expedienteAConcluir = ref(null);
const codigoSubserieConcluir = ref("");
const catalogoSeriesEstructurado = ref([]);

// === ESTADOS MODAL 3: DETALLES Y BITÁCORA ===
const modalDetallesAbierto = ref(false);
const expedienteDetalle = ref(null);
const historialBitacora = ref([]);
const loadingBitacora = ref(false);

// === FLUJO 3: DETALLES ===
const abrirModalDetalles = async (item) => {
    expedienteDetalle.value = item;
    modalDetallesAbierto.value = true;

    // Cargar la línea de tiempo inmutable
    await cargarBitacora(item.id);
};

const cargarBitacora = async (idExpediente) => {
    loadingBitacora.value = true;
    try {
        // NUEVO: Agregamos el JOIN con la tabla de usuarios
        const { data, error } = await supabase
            .from("bitacora_movimientos")
            .select(`
        *,
        usuario:id_usuario (nombre, email) 
      `)
            .eq("id_expediente", idExpediente)
            .order("fecha_hora", { ascending: false });

        if (error) throw error;
        historialBitacora.value = data || [];
    } catch (error) {
        console.error("Error al cargar bitácora:", error);
        toast.error("No se pudo cargar el historial de trazabilidad.");
    } finally {
        loadingBitacora.value = false;
    }
};


const cerrarModalDetalles = () => {
    modalDetallesAbierto.value = false;
    historialBitacora.value = []; // Limpiamos al cerrar
};

// === COMPUTADOS ===
const expedientesFiltrados = computed(() => {
    if (filtroEstatus.value === "Todos") return listaExpedientes.value;
    return listaExpedientes.value.filter(
        (exp) => exp.estatus === filtroEstatus.value,
    );
});

const detalleSerieSeleccionada = computed(() => {
    if (!codigoSubserieConcluir.value) return null;
    for (const serie of catalogoSeriesEstructurado.value) {
        const subFound = serie.subseries.find(
            (s) => s.codigoSubserie === codigoSubserieConcluir.value,
        );
        if (subFound) return subFound;
    }
    return null;
});

// UTILIDAD PARA ARREGLOS DE BD (Soporte, Tradición, Condición)
const obtenerValorArreglo = (valor) => {
    if (!valor) return "";

    // Si es un arreglo nativo de JavaScript
    if (Array.isArray(valor)) return valor[0];

    // Si viene como string crudo desde la BD (ej. '["Original"]' o '{"Original"}')
    if (typeof valor === "string") {
        // Limpieza con Expresión Regular: quita corchetes, llaves y comillas dobles
        return valor.replace(/[[\]"{}]/g, "").trim();
    }

    return valor;
};

// === CARGAS DE BASE DE DATOS ===
const inicializarUsuario = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: userData } = await supabase
            .from("usuarios")
            .select("id, secciones_permitidas, rol")
            .eq("email", user.email)
            .single();

        usuarioActual.value = userData.id;

        // Construimos la consulta base de áreas
        let querySec = supabase.from("cuadro_general").select("id, codigo, seccion").order("codigo");

        // Si NO es admin, validamos estrictamente sus secciones permitidas
        if (userData.rol !== 'admin') {
            if (!userData.secciones_permitidas || userData.secciones_permitidas.length === 0) {
                loading.value = false; // Apagamos el loader si no tiene áreas
                return;
            }
            querySec = querySec.in("codigo", userData.secciones_permitidas);
        }

        // Ejecutamos la consulta
        const { data: secciones } = await querySec;
        areasUsuario.value = secciones || [];

        // Si tiene áreas (o es admin y cargó todas), cargamos la primera
        if (areasUsuario.value.length > 0) {
            seccionSeleccionada.value = areasUsuario.value[0].id;
            await cargarBandeja();
        } else {
            loading.value = false; // Apagamos el loader si la tabla cuadro_general está vacía
        }

    } catch (error) {
        console.error("Error inicializando:", error);
        toast.error("Error al inicializar sesión.");
        loading.value = false; // Seguro contra fallos
    }
};

const cargarBandeja = async () => {
    if (!seccionSeleccionada.value) return;
    loading.value = true;

    // Obtenemos los datos visuales del área actual para el título
    miSeccion.value = areasUsuario.value.find(
        (a) => a.id === seccionSeleccionada.value,
    );

    try {
        // NUEVO: La consulta ahora pide también el área_destino
        let query = supabase
            .from("expedientes")
            .select("*, area_origen:id_seccion_registro (codigo, seccion), area_destino:id_seccion_turnada (codigo, seccion)")
            .order("fecha_registro", { ascending: false })
            .order("hora_registro", { ascending: false });

        // Lógica dinámica del filtro
        if (vistaActual.value === "entrada") {
            // BANDEJA DE ENTRADA: 
            query = query
                .eq("id_seccion_turnada", seccionSeleccionada.value)
                .neq("tipo_registro", "Enviado");
        } else {
            // MIS ENVIADOS: 
            query = query
                .eq("id_seccion_registro", seccionSeleccionada.value)
                .or(`id_seccion_turnada.neq.${seccionSeleccionada.value},tipo_registro.eq.Enviado`);
        }

        const { data: expedientes, error } = await query;
        if (error) throw error;

        listaExpedientes.value = expedientes || [];

        const { data: seriesDB } = await supabase
            .from("series")
            .select("id, codigo_serie, nombre, subseries")
            .eq("id_seccion", seccionSeleccionada.value)
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
    } catch (error) {
        toast.error("Error al cargar datos del área.");
    } finally {
        loading.value = false;
    }
};

// === FLUJO 1: ASIGNAR / ATENDER ===
const abrirModalAtender = (item) => {
    expedienteAAtender.value = item;
    formAtender.value = {
        responsable_tramite: item.responsable_tramite || "",
        indicaciones_tramite: item.indicaciones_tramite || "",
        tradicion: obtenerValorArreglo(item.tradicion) || "Original",
        soporte: obtenerValorArreglo(item.soporte) || "Papel",
        condicion_acceso: obtenerValorArreglo(item.condicion_acceso) || "Pública",
        inmueble: item.inmueble || "",
        ubicacion_url: item.ubicacion_url || "",
    };
    modalAtenderAbierto.value = true;
};

const cerrarModalAtender = () => {
    if (!procesando.value) modalAtenderAbierto.value = false;
};

const ejecutarAtencion = async () => {
    formAtender.value.responsable_tramite =
        formAtender.value.responsable_tramite.trim();
    if (!formAtender.value.responsable_tramite)
        return toast.error("El responsable es obligatorio.");

    procesando.value = true;
    try {
        const payload = {
            estatus: "En trámite",
            responsable_tramite: formAtender.value.responsable_tramite,
            indicaciones_tramite: formAtender.value.indicaciones_tramite.trim(),
            inmueble: formAtender.value.inmueble,
            ubicacion_url: formAtender.value.ubicacion_url,
            id_usuario_actualizacion: usuarioActual.value,
            soporte: formAtender.value.soporte,
            tradicion: formAtender.value.tradicion,
            condicion_acceso: formAtender.value.condicion_acceso,
        };

        const { error } = await supabase
            .from("expedientes")
            .update(payload)
            .eq("id", expedienteAAtender.value.id);
        if (error) throw error;

        toast.success("Trámite asignado y actualizado correctamente.");
        await cargarBandeja();
        modalAtenderAbierto.value = false;
    } catch (error) {
        toast.error("Error al asignar el trámite.");
    } finally {
        procesando.value = false;
    }
};

// === FLUJO 2: CONCLUIR Y SNAPSHOT ===
const abrirModalConcluir = (item) => {
    expedienteAConcluir.value = item;
    codigoSubserieConcluir.value = item.codigo_subserie || "";
    modalConcluirAbierto.value = true;
};

const cerrarModalConcluir = () => {
    if (!procesando.value) modalConcluirAbierto.value = false;
};

const ejecutarConclusion = async () => {
    if (!codigoSubserieConcluir.value || !detalleSerieSeleccionada.value) {
        return toast.error("Debes seleccionar una subserie para archivar.");
    }

    procesando.value = true;
    try {
        // CONSTRUCCIÓN DEL SNAPSHOT HISTÓRICO JSONB
        const snapshotCadido = {
            codigo_padre: detalleSerieSeleccionada.value.codigo_serie_padre,
            nombre_padre: detalleSerieSeleccionada.value.nombre_serie_padre,
            codigo_subserie: detalleSerieSeleccionada.value.codigoSubserie,
            nombre_subserie: detalleSerieSeleccionada.value.nombre,
            valor_documental: detalleSerieSeleccionada.value.valor_documental,
            anios_tramite: detalleSerieSeleccionada.value.at,
            anios_concentracion: detalleSerieSeleccionada.value.ac,
            fecha_clasificacion: new Date().toISOString(),
        };

        const payload = {
            estatus: "Concluido",
            codigo_subserie: codigoSubserieConcluir.value,
            id_serie: detalleSerieSeleccionada.value.id_serie_padre,
            id_usuario_actualizacion: usuarioActual.value,
            snapshot_cadido: snapshotCadido, // Guardamos la foto inmutable
        };

        const { error } = await supabase
            .from("expedientes")
            .update(payload)
            .eq("id", expedienteAConcluir.value.id);
        if (error) throw error;

        toast.success(
            `Expediente ${expedienteAConcluir.value.numero_consecutivo} clasificado y archivado.`,
        );
        await cargarBandeja();
        modalConcluirAbierto.value = false;
    } catch (err) {
        toast.error("Error al concluir el expediente.");
    } finally {
        procesando.value = false;
    }
};

// === ESTADOS Y LÓGICA DE CANCELACIÓN (LOCAL) ===
const modalCancelarAbierto = ref(false)
const procesandoCancelacion = ref(false)
const cancelarId = ref(null)
const folioACancelar = ref('')
const motivoCancelacion = ref('')

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
        const notaJustificacion = `[CANCELADO POR ÁREA LOCAL]: ${motivoCancelacion.value}`

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
        await cargarBandeja()
        modalCancelarAbierto.value = false
    } catch (err) {
        toast.error(err.message || "Error al intentar cancelar el registro.")
    } finally {
        procesandoCancelacion.value = false
    }
}

// === UTILIDADES VISUALES ===
const formatFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const [year, month, day] = fechaISO.split("-");
    return `${day}/${month}/${year}`;
};

// Utilidad para la línea de tiempo (formatea fecha y hora)
const formatFechaHora = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const badgeColor = (estatus) => {
    switch (estatus) {
        case "Recepcionado":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
        case "En trámite":
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
        case "Concluido":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
        case "Cancelado":
            return "bg-red-50 text-red-600/70 border border-red-200/60 dark:bg-red-900/20 dark:text-red-400/70 dark:border-red-800/50";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
};

const abrirModalNuevoInterno = () => {
    // Verificamos que haya un área seleccionada para usarla como origen
    if (!seccionSeleccionada.value) {
        return toast.error("Selecciona un área en la cabecera primero.");
    }
    modalNuevoAbierto.value = true;
};

// Intercepta el éxito, cierra el modal y recarga
const onRegistroInternoExitoso = async () => {
    modalNuevoAbierto.value = false; // Cerramos el modal inmediatamente
    await cargarBandeja();           // Recargamos la tabla con el nuevo registro
};

onMounted(() => {
    inicializarUsuario();
});
</script>
