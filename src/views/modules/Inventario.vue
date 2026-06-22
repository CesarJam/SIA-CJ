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
                    <strong class="text-blue-600 dark:text-blue-400">{{ miSeccion?.codigo }}</strong>
                </p>
                <div
                    class="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-fit border border-gray-200 dark:border-gray-700 shadow-inner">
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
                <select v-model="seccionSeleccionada" @change="cargarBandeja"
                    class="w-full md:w-auto truncate max-w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                    <option v-for="area in areasUsuario" :key="area.id" :value="area.id">
                        {{ area.codigo }} - {{ area.seccion }}
                    </option>
                </select>

                <select v-model="filtroAnio" @change="cargarBandeja"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer font-bold">
                    <option v-for="anio in opcionesAnios" :key="anio" :value="anio">
                        Año {{ anio }}
                    </option>
                </select>

                <select v-model="filtroEstatus"
                    class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                    <option value="Todos">Todos los estatus</option>
                    <option value="Recepcionado">Recepcionado (Nuevos)</option>
                    <option value="En trámite">En trámite</option>
                    <option value="Concluido">Concluido (Archivados)</option>
                    <option value="Cancelado">Cancelados</option>
                </select>

                <button @click="abrirModalExportar"
                    class="w-full md:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    CSV
                </button>

                <button @click="abrirModalExportarPDF"
                    class="w-full md:w-auto px-4 py-2 text-sm font-semibold text-white bg-[#AB0033] hover:bg-[#8A0029] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                        </path>
                    </svg>
                    PDF
                </button>

                <button @click="abrirModalNuevoInterno"
                    class="w-full md:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Nuevo
                </button>

            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-[10%]">Folio / Fecha</div>
                <div class="w-[30%]">Asunto y Seguimiento</div>
                <div class="w-[20%]">{{ vistaActual === 'entrada' ? 'Origen (Remitente)' : 'Destino (Turnado a)' }}</div>
                <div class="w-[20%]">Dependencias</div>
                <div class="w-[20%] text-center">Estatus / Acción</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-if="menuActivoId" @click="cerrarMenu" class="fixed inset-0 z-10"></div>
                <div v-for="(item, index) in expedientesFiltrados" :key="item.id"
                    class="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-start gap-2 md:gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20 last:rounded-b-xl"
                    :class="{
                        'bg-gray-50/50 dark:bg-gray-900/40': item.estatus === 'Concluido',
                        'relative z-20': menuActivoId === item.id,
                        'relative z-0': menuActivoId !== item.id,
                    }">
                    
                    <div class="w-full md:w-[10%] flex flex-col md:block">
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ item.numero_consecutivo }}</span>
                        <span v-if="item.caracter === 'Urgente' || item.caracter === 'Extraordinario'"
                            :class="claseBadgeCaracter(item.caracter)">
                            {{ item.caracter }}
                        </span>
                        <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {{ formatFecha(item.fecha_registro) }}
                        </div>
                    </div>

                    <div class="w-full md:w-[30%] flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Asunto:</span>
                        <span class="text-sm text-gray-800 dark:text-white line-clamp-2" :title="item.asunto">
                            {{ item.asunto }}
                        </span>

                        <div v-if="item.responsable_tramite"
                            class="mt-2 flex items-start gap-1.5 p-2 bg-blue-50 dark:bg-blue-900/40 rounded-md border border-blue-100 dark:border-blue-800/50">
                            <svg class="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <div class="flex flex-col">
                                <span class="text-xs font-semibold text-blue-700 dark:text-blue-200">Responsable: {{
                                    item.responsable_tramite }}</span>
                                <span v-if="item.indicaciones_tramite"
                                    class="text-[10px] text-blue-600/80 dark:text-blue-300 italic mt-0.5 line-clamp-1"
                                    :title="item.indicaciones_tramite">"{{ item.indicaciones_tramite }}"</span>
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-[20%] flex flex-col md:block mt-1 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">
                            {{ vistaActual === 'entrada' ? 'Origen:' : 'Destino:' }}
                        </span>

                        <span v-if="vistaActual === 'entrada'"
                            class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ item.area_origen?.codigo || "Externo" }} - {{ item.area_origen?.seccion || "No definido" }}
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

                    <div class="w-full md:w-[20%] flex flex-col md:block mt-2 md:mt-0">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">Dependencias:</span>
                        <div class="flex flex-wrap gap-1">
                            <template v-if="obtenerNombresDependencias(item.dependencias_ids).length > 0">
                                <span v-for="dep in obtenerNombresDependencias(item.dependencias_ids)" :key="dep.id"
                                    class="inline-block px-2 py-1 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50 max-w-full whitespace-normal break-words leading-tight"
                                    :title="dep.nombre_oficial">
                                    {{ dep.siglas ? `${dep.siglas} - ${dep.nombre_oficial}` : dep.nombre_oficial }}
                                </span>
                            </template>
                            <span v-else class="text-[11px] text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">Ninguna</span>
                        </div>
                    </div>

                    <div class="w-full md:w-[20%] flex justify-between items-center md:justify-center mt-3 md:mt-0 gap-3">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estatus:</span>

                        <div class="flex flex-col items-center gap-2 w-full">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-md w-full text-center"
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
                                        :class="expedientesFiltrados.length > 3 && index >= expedientesFiltrados.length - 2
                                            ? 'bottom-full mb-1 origin-bottom-right'
                                            : 'top-full mt-1 origin-top-right'
                                            ">
                                        <template
                                            v-if="vistaActual === 'enviados' && item.id_seccion_turnada !== seccionSeleccionada">
                                            <button @click="abrirModalDetalles(item); cerrarMenu();"
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
                                                <button @click="abrirModalAtender(item); cerrarMenu();"
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 flex items-center gap-2.5 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                    </svg>
                                                    Asignar Trámite
                                                </button>
                                                <button @click="abrirModalEditar(item); cerrarMenu();"
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-500 dark:hover:bg-amber-900/30 flex items-center gap-2.5 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                        </path>
                                                    </svg>
                                                    Editar Registro
                                                </button>
                                                <button @click="abrirModalDetalles(item); cerrarMenu();"
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
                                                <button @click="abrirModalConcluir(item); cerrarMenu();"
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 flex items-center gap-2.5 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Clasificar y Concluir
                                                </button>
                                                <button @click="abrirModalAtender(item); cerrarMenu();"
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
                                                <button @click="abrirModalDetalles(item); cerrarMenu();"
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
                                                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 flex items-center gap-2.5 transition-colors">
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
                                                <button v-if="rolUsuario === 'admin'"
                                                    @click="abrirModalEdicionAdmin(item); cerrarMenu();"
                                                    class="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition-colors border-t border-gray-100 dark:border-gray-700/50">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                                        </path>
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                                        </path>
                                                    </svg>
                                                    Corrección Administrativa
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
                <svg class="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
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

        <ModalRegistroDocumento v-model="modalNuevoAbierto" :origenId="seccionSeleccionada || ''"
            :datosEditar="expedienteAEditar" @guardado="onRegistroInternoExitoso" />

        <ModalAtender v-model="modalAtenderAbierto" :expediente="expedienteAAtender"
            :usuarioActual="usuarioActual || ''" @guardado="cargarBandeja" />

        <ModalConcluir v-model="modalConcluirAbierto" :expediente="expedienteAConcluir"
            :catalogoSeries="catalogoSeriesEstructurado" :usuarioActual="usuarioActual || ''"
            @guardado="cargarBandeja" />

        <ModalDetalles v-model="modalDetallesAbierto" :expediente="expedienteDetalle" />

        <ModalCancelar v-model="modalCancelarAbierto" :expediente="expedienteACancelar"
            :usuarioActual="usuarioActual || ''" @guardado="cargarBandeja" />

        <ModalExportar v-model="modalExportarAbierto" :seccionId="seccionSeleccionada" :miSeccion="miSeccion"
            :opcionesAnios="opcionesAnios" :anioDefecto="filtroAnio" />

        <ModalExportarPDF v-model="modalExportarPDFAbierto" :seccionId="seccionSeleccionada" :miSeccion="miSeccion"
            :opcionesAnios="opcionesAnios" :anioDefecto="filtroAnio" />
            
        <ModalEdicionAdmin v-model="modalEdicionAdminAbierto" :expediente="expedienteAdmin"
            :catalogoSeries="catalogoSeriesEstructurado" :usuarioActual="usuarioActual || ''"
            @guardado="cargarBandeja" />
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase";
import { useToast } from "@/composables/useToast";
import ModalRegistroDocumento from '@/components/ModalRegistroDocumento.vue';
import ModalAtender from '@/components/ModalAtender.vue';
import ModalConcluir from '@/components/ModalConcluir.vue';
import ModalDetalles from '@/components/ModalDetalles.vue';
import ModalCancelar from '@/components/ModalCancelar.vue';
import ModalExportar from "@/components/ModalExportar.vue";
import ModalExportarPDF from '@/components/ModalExportarPDF.vue';
import ModalEdicionAdmin from '@/components/ModalEdicionAdmin.vue';

const toast = useToast();

const modalNuevoAbierto = ref(false);
const expedienteAEditar = ref(null);

const abrirModalEditar = (item) => {
    expedienteAEditar.value = item; // Guardamos los datos del expediente a editar
    modalNuevoAbierto.value = true; // Abrimos el mismo modal
};

// === ESTADOS GLOBALES ===
const loading = ref(true);
const procesando = ref(false);
const listaExpedientes = ref([]);
const usuarioActual = ref(null);
const rolUsuario = ref(null);

const areasUsuario = ref([]);
const seccionSeleccionada = ref(null);
const miSeccion = ref(null);
const filtroEstatus = ref("Todos");
const vistaActual = ref("entrada"); // 'entrada' | 'enviados'

const anioActual = new Date().getFullYear();
// Crea un arreglo de 8 elementos (El año actual + 7 hacia atrás)
const opcionesAnios = ref(Array.from({ length: 8 }, (_, i) => anioActual - i));
const filtroAnio = ref(anioActual);

// === CATÁLOGO GLOBAL DE DEPENDENCIAS ===
const catalogoDependencias = ref([]);

const cargarCatalogoDependenciasGlobal = async () => {
    try {
        const { data, error } = await supabase.from('dependencias').select('id, nombre_oficial, siglas');
        if (!error && data) {
            catalogoDependencias.value = data;
        }
    } catch (err) {
        console.error("Error al cargar dependencias globales:", err);
    }
};

const obtenerNombresDependencias = (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
    return catalogoDependencias.value.filter(dep => ids.includes(dep.id));
};

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

// === ESTADOS MODAL 2: CONCLUIR ===
const modalConcluirAbierto = ref(false);
const expedienteAConcluir = ref(null);
const catalogoSeriesEstructurado = ref([]);

// === ESTADOS MODAL 3: DETALLES Y BITÁCORA ===
const modalDetallesAbierto = ref(false);
const expedienteDetalle = ref(null);

// === ESTADOS MODAL 4: CANCELAR ===
const modalCancelarAbierto = ref(false);
const expedienteACancelar = ref(null);

// == ESTADOS MODAL 5: EDICIÓN ADMIN ===
const modalEdicionAdminAbierto = ref(false);
const expedienteAdmin = ref(null);

// === FLUJO 1: ASIGNAR / ATENDER ===
const abrirModalAtender = (item) => {
    expedienteAAtender.value = item;
    modalAtenderAbierto.value = true;
};

// === FLUJO 2: CONCLUIR Y SNAPSHOT ===
const abrirModalConcluir = (item) => {
    expedienteAConcluir.value = item;
    modalConcluirAbierto.value = true;
};

// === FLUJO 3: DETALLES ===
const abrirModalDetalles = async (item) => {
    expedienteDetalle.value = item;
    modalDetallesAbierto.value = true;
};

// === FLUJO 4: CANCELAR ===
const abrirModalCancelar = (item) => {
    expedienteACancelar.value = item;
    modalCancelarAbierto.value = true;
};

// === FLUJO 5: EDICIÓN ADMIN ===
const abrirModalEdicionAdmin = (item) => {
    expedienteAdmin.value = item;
    modalEdicionAdminAbierto.value = true;
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
        rolUsuario.value = userData.rol;

        // CARGAMOS EL CATÁLOGO DE DEPENDENCIAS DE FORMA GLOBAL
        await cargarCatalogoDependenciasGlobal();

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
        let query = supabase
            .from("expedientes")
            .select("*, area_origen:id_seccion_registro (codigo, seccion), area_destino:id_seccion_turnada (codigo, seccion)")
            .gte("fecha_registro", `${filtroAnio.value}-01-01`)
            .lte("fecha_registro", `${filtroAnio.value}-12-31`)
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

const abrirModalNuevoInterno = () => {
    // Verificamos que haya un área seleccionada para usarla como origen
    if (!seccionSeleccionada.value) {
        return toast.error("Selecciona un área en la cabecera primero.");
    }
    expedienteAEditar.value = null; // <-- LIMPIAMOS LA VARIABLE AQUÍ
    modalNuevoAbierto.value = true;
};

// Intercepta el éxito, cierra el modal y recarga
const onRegistroInternoExitoso = async () => {
    modalNuevoAbierto.value = false; // Cerramos el modal inmediatamente
    await cargarBandeja();           // Recargamos la tabla con el nuevo registro
};

// ==ESTADOS MODAL 6: MODAL EXPORTAR ===
const modalExportarAbierto = ref(false);

// == FLUJO MODAL 6: MODAL EXPORTAR
const abrirModalExportar = () => {
    if (!seccionSeleccionada.value) {
        return toast.error("Selecciona un área en la cabecera primero.");
    }
    modalExportarAbierto.value = true;
};

// ==ESTADOS MODAL 7: MODAL EXPORTAR PDF ===
const modalExportarPDFAbierto = ref(false);

// == FLUJO MODAL 7: MODAL EXPORTAR PDF
const abrirModalExportarPDF = () => {
    if (!seccionSeleccionada.value) return toast.error("Selecciona un área en la cabecera primero.");
    modalExportarPDFAbierto.value = true;
};

// Función para asignar colores dinámicos al badge de Carácter en la tabla
const claseBadgeCaracter = (caracter) => {
    const c = (caracter || '').toLowerCase()

    // Clases base que comparten todos los badges del inventario
    const clasesBase = "ml-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border mb-0.5 "

    if (c.includes('urgente')) {
        return clasesBase + "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800"
    }
    if (c.includes('extraordinario') || c.includes('extra')) {
        return clasesBase + "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-purple-200 dark:border-purple-800"
    }

    // Por si en un futuro decides mostrar también el Ordinario
    return clasesBase + "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
}

const badgeColor = (estatus) => {
    switch (estatus) {
        case "Recepcionado":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300 border border-blue-300 dark:border-blue-600";
        case "En trámite":
            return "bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300 border border-amber-300 dark:border-amber-600";
        case "Concluido":
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600";
        case "Cancelado":
            return "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300 border border-red-300 dark:border-red-600";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/80 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
    }
};

onMounted(() => {
    inicializarUsuario();
});

</script>