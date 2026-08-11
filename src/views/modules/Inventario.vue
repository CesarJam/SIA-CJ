<template>
    <div class="fade-in relative min-h-screen pb-10">
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                    Inventario Documental
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 inline-block min-w-[80px]">
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

            <!-- CONTENEDOR PRINCIPAL DE HERRAMIENTAS -->
            <div class="w-full md:w-auto">
                
                <!-- Botón Toggle para Móviles (Visible solo en pantallas pequeñas) -->
                <button @click="menuFiltrosAbierto = !menuFiltrosAbierto"
                    class="md:hidden w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-colors mb-3 md:mb-0">
                    <span class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        Filtros y Acciones
                    </span>
                    <svg class="w-4 h-4 transition-transform duration-200" :class="{'rotate-180': menuFiltrosAbierto}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <!-- Área Colapsable (Oculta en móvil por defecto, siempre visible en PC) -->
                <div :class="{'hidden md:flex': !menuFiltrosAbierto, 'flex': menuFiltrosAbierto}" 
                    class="flex-col md:flex-row flex-wrap items-center gap-3 w-full md:w-auto transition-all">
                    
                    <!--Filtro de area -->
                    <select v-model="seccionSeleccionada" @change="cargarBandeja"
                        class="w-full md:w-72 truncate max-w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                        <option v-for="area in areasUsuario" :key="area.id" :value="area.id">
                            {{ area.codigo }} - {{ area.seccion }}
                        </option>
                    </select>

                    <!--Filtro de año -->
                    <select v-model="filtroAnio" @change="cargarBandeja"
                        class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer font-bold">
                        <option v-for="anio in opcionesAnios" :key="anio" :value="anio">
                            Año {{ anio }}
                        </option>
                    </select>

                    <!--Filtro de estatus -->
                    <select v-model="filtroEstatus"
                        class="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
                        <option value="Todos">Todos los estatus</option>
                        <option value="Recepcionado">Recepcionado (Nuevos)</option>
                        <option value="En trámite">En trámite</option>
                        <option value="Concluido">Concluido (Archivados)</option>
                        <option value="Cancelado">Cancelados</option>
                    </select>

                    <!--Botón y Menú de Filtro Avanzado -->
                    <div class="relative w-full md:w-auto">
                        <button @click="filtroAvanzadoAbierto = !filtroAvanzadoAbierto"
                            class="w-full md:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                            :class="{'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30': filtroSerieSeleccionada}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                            </svg>
                            Filtros
                            <span v-if="filtroSerieSeleccionada" class="flex h-2.5 w-2.5 relative ml-1">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>
                        </button>

                        <div v-if="filtroAvanzadoAbierto" @click="filtroAvanzadoAbierto = false" class="fixed inset-0 z-30"></div>

                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <div v-if="filtroAvanzadoAbierto"
                                class="absolute left-0 right-0 md:left-auto md:right-0 mt-2 w-full md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-40 p-4 origin-top md:origin-top-right">
                                <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Filtro Avanzado</h3>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Serie / Subserie (CADIDO)</label>
                                        <select v-model="filtroSerieSeleccionada"
                                            class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500">
                                            <option value="">Todas (Sin filtro)</option>
                                            <optgroup v-for="serie in seriesDisponiblesEnBandeja" 
                                                :key="serie.codigo_serie" 
                                                :label="`${serie.codigo_serie} - ${serie.nombre_serie}`"
                                                class="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800">
                                                <option v-for="sub in serie.subseries" 
                                                    :key="sub.codigo_subserie" 
                                                    :value="sub.codigo_subserie"
                                                    class="font-normal text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                                                    {{ sub.codigo_subserie }} - {{ sub.nombre_subserie }}
                                                </option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    <div class="flex gap-2">
                                        <button @click="filtroSerieSeleccionada = ''; filtroAvanzadoAbierto = false" 
                                            class="w-full px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                                            Limpiar
                                        </button>
                                        <button @click="filtroAvanzadoAbierto = false" 
                                            class="w-full px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                            Aplicar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>

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
                        class="w-full md:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        title="Nuevo registro (Ctrl + Espacio)">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Nuevo
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[700px]">
            <div
                class="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="w-[10%]">Folio / Fecha</div>
                <div class="w-[50%]">Asunto y Seguimiento</div>
                <div class="w-[15%]">{{ vistaActual === 'entrada' ? 'Origen (Remitente)' : 'Destino (Turnado a)' }}</div>
                <div class="w-[15%]">Dependencias/Serie</div>
                <div class="w-[10%] text-center">Estatus / Acción</div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div v-if="menuActivoId" @click="cerrarMenu" class="fixed inset-0 z-10"></div>

                <!-- 1. SKELETONS (Se muestran mientras Supabase carga) -->
                <template v-if="loading">
                    <!-- Dibujamos 6 filas falsas simulando las proporciones reales -->
                    <div v-for="i in 6" :key="'skel-' + i" class="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-start gap-2 md:gap-4 animate-pulse bg-white dark:bg-gray-800">
                        
                        <!-- Columna 1: Folio / Fecha (10%) -->
                        <div class="w-full md:w-[10%] flex flex-col gap-2 mt-1">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>

                        <!-- Columna 2: Asunto (50%) -->
                        <div class="w-full md:w-[50%] mt-1 md:mt-0 flex flex-col gap-2">
                            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                            <div class="mt-2 h-12 bg-gray-100 dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-700/50 w-3/4"></div>
                        </div>

                        <!-- Columna 3: Origen / Destino (15%) -->
                        <div class="w-full md:w-[15%] mt-1 md:mt-0 flex flex-col gap-2">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                        </div>

                        <!-- Columna 4: Dependencias (15%) -->
                        <div class="w-full md:w-[15%] mt-2 md:mt-0 flex flex-col gap-2">
                            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                            <div class="mt-3 h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>

                        <!-- Columna 5: Acciones (10%) -->
                        <div class="w-full md:w-[10%] flex flex-col items-center gap-2 mt-3 md:mt-0">
                            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-full mt-1"></div>
                        </div>
                    </div>
                </template>

                <!-- 2. ESTADO VACÍO (Sin registros) -->
                <div v-else-if="expedientesPaginados.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    No se encontraron expedientes en esta bandeja.
                </div>

                <!-- 3. LOS DATOS REALES (Tu código original) -->
                <template v-else>
                    <div v-for="(item, index) in expedientesPaginados" :key="item.id"
                        :id="`expediente-${item.id}`"
                        class="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-start gap-2 md:gap-4 transition-all duration-1000 ease-out last:rounded-b-xl"
                        :class="{
                            'bg-gray-50/50 dark:bg-gray-900/40': item.estatus === 'Concluido' && registroResaltado !== item.id,
                            'hover:bg-gray-50 dark:hover:bg-gray-700/20': registroResaltado !== item.id,
                            'relative z-20': menuActivoId === item.id,
                            'relative z-10': registroResaltado === item.id,
                            'relative z-0': menuActivoId !== item.id && registroResaltado !== item.id,
                            'bg-blue-100/80 dark:bg-blue-900/50 ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-[1.01]': registroResaltado === item.id
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

                        <div class="w-full md:w-[50%] flex flex-col md:block mt-1 md:mt-0">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">Asunto:</span>
                            <div class="flex items-start gap-2">
                            <!-- El Asunto -->
                            <span class="text-lg text-gray-800 dark:text-white line-clamp-2 flex-1" :title="item.asunto">
                                {{ item.asunto }}
                            </span>
                            
                            <!-- El Ojito (Solo se muestra si está Concluido o En trámite para no estorbar en nuevos) -->
                            <button v-if="item.estatus !== 'Recepcionado'" @click.stop="verPrimerPDF(item.id)" 
                                class="mt-1 p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors shrink-0"
                                title="Ver documento principal">
                                
                                <!-- Spinner mientras carga -->
                                <svg v-if="cargandoPreviewId === item.id" class="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                
                                <!-- Ícono del Ojo -->
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>

                            <div v-if="item.responsable_tramite"
                                class="mt-2 flex items-start gap-1.5 p-2 bg-blue-50 dark:bg-blue-900/40 rounded-md border border-blue-100 dark:border-blue-800/50">
                                <svg class="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                    </path>
                                </svg>
                                <div class="flex flex-col">
                                    <span class="text-[10px] font-semibold text-blue-700 dark:text-blue-200">
                                        Responsable: {{
                                        item.responsable_tramite }}
                                    </span>
                                    <span v-if="item.indicaciones_tramite"
                                        class="text-[10px] text-blue-600/80 dark:text-blue-300 italic mt-0.5 line-clamp-1"
                                        :title="item.indicaciones_tramite">"{{ item.indicaciones_tramite }}"
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="w-full md:w-[15%] flex flex-col md:block mt-1 md:mt-0">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">
                                {{ vistaActual === 'entrada' ? 'Origen:' : 'Destino:' }}
                            </span>

                            <span v-if="vistaActual === 'entrada'"
                                class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ item.area_origen?.codigo || "Externo" }} - {{ item.area_origen?.seccion || "No definido" }}
                            </span>
                            <span v-else class="text-sm font-medium text-white-600 dark:text-white-400">
                                {{ item.area_destino?.codigo }} - {{ item.area_destino?.seccion }}
                            </span>

                            <div class="mt-1.5">
                                <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md"
                                    :class="obtenerValorArreglo(item.tradicion) === 'Original' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                    {{ obtenerValorArreglo(item.tradicion) }}
                                </span>
                            </div>
                        </div>

                        <div class="w-full md:w-[15%] flex flex-col md:block mt-2 md:mt-0">
                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">Dependencias:</span>
                            
                            <div class="flex flex-wrap gap-1">
                                <template v-if="obtenerNombresDependencias(item.dependencias_ids).length > 0">
                                    <span v-for="dep in obtenerNombresDependencias(item.dependencias_ids)" :key="dep.id"
                                        class="inline-block px-2 py-1 rounded text-[10px] font-bold bg-sky-500/75 text-sky-700 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50 max-w-full whitespace-normal break-words leading-tight"
                                        :title="dep.nombre_oficial">
                                        {{ dep.siglas ? `${dep.siglas} - ${dep.nombre_oficial}` : dep.nombre_oficial }}
                                    </span>
                                </template>
                                <span v-else class="text-[11px] text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">Ninguna</span>
                            </div>

                            <div v-if="item.snapshot_cadido && item.snapshot_cadido.codigo_padre" class="mt-3 pt-2.5 border-t border-gray-200 dark:border-gray-700/60">
                                <div class="flex flex-col gap-1.5">
                                    <div class="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">
                                        <span class="font-bold text-white-700 dark:text-white-400">{{ item.snapshot_cadido.codigo_padre }}</span>
                                        <span class="block line-clamp-2" :title="item.snapshot_cadido.nombre_padre">{{ item.snapshot_cadido.nombre_padre }}</span>
                                    </div>
                                    <div class="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">
                                        <span class="font-bold text-white-700 dark:text-white-400">{{ item.snapshot_cadido.codigo_subserie }}</span>
                                        <span class="block line-clamp-2" :title="item.snapshot_cadido.nombre_subserie">{{ item.snapshot_cadido.nombre_subserie }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full md:w-[10%] flex justify-between items-center md:justify-center mt-3 md:mt-0 gap-3">
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
                </template>
            </div>
            <div v-if="expedientesFiltrados.length > 100" class="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 gap-4">
                
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    <template v-if="registrosPorPagina === 0">
                        Mostrando todos los <span class="font-bold text-gray-900 dark:text-white">{{ expedientesFiltrados.length }}</span> registros
                    </template>
                    <template v-else>
                        Mostrando <span class="font-bold text-gray-900 dark:text-white">{{ ((paginaActual - 1) * registrosPorPagina) + 1 }}</span> a 
                        <span class="font-bold text-gray-900 dark:text-white">{{ Math.min(paginaActual * registrosPorPagina, expedientesFiltrados.length) }}</span> de 
                        <span class="font-bold text-gray-900 dark:text-white">{{ expedientesFiltrados.length }}</span> registros
                    </template>
                </span>
                
                <div class="flex items-center gap-2">
                    <!-- Botón Ver Todos -->
                    <button @click="toggleVerTodos"
                        class="px-3 py-1.5 text-sm font-bold rounded-md transition-colors shadow-sm"
                        :class="registrosPorPagina === 0 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'">
                        {{ registrosPorPagina === 0 ? 'Paginar vista' : 'Ver todos' }}
                    </button>

                    <!-- Controles de Paginación (Se ocultan si está en Ver Todos) -->
                    <div v-show="registrosPorPagina > 0" class="flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
                        <button @click="irAPagina(paginaActual - 1)" :disabled="paginaActual === 1"
                            class="px-3 py-1.5 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm">
                            Anterior
                        </button>
                        
                        <span class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Página {{ paginaActual }} de {{ totalPaginas }}
                        </span>
                        
                        <button @click="irAPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                            class="px-3 py-1.5 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ModalRegistroDocumento v-model="modalNuevoAbierto" 
            :origenId="seccionSeleccionada || ''"
            :datosEditar="expedienteAEditar"
            :tipoRegistroDefecto="vistaActual === 'entrada' ? 'Recibido' : 'Enviado'"
             @guardado="onRegistroInternoExitoso" />

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

        <ModalPDFPreview v-model="modalPreviewAbierto" :rutaArchivo="rutaPreview" />
    </div>

</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from "vue";
// --- IMPORTAMOS EL SERVICIO ---
import { inventarioService } from "@/services/inventarioService";
import { useToast } from "@/composables/useToast";

import ModalRegistroDocumento from '@/components/ModalRegistroDocumento.vue';
import ModalAtender from '@/components/ModalAtender.vue';
import ModalConcluir from '@/components/ModalConcluir.vue';
import ModalDetalles from '@/components/ModalDetalles.vue';
import ModalCancelar from '@/components/ModalCancelar.vue';
import ModalExportar from "@/components/ModalExportar.vue";
import ModalExportarPDF from '@/components/ModalExportarPDF.vue';
import ModalEdicionAdmin from '@/components/ModalEdicionAdmin.vue';
import ModalPDFPreview from '@/components/ModalPDFPreview.vue';

const toast = useToast();

const modalNuevoAbierto = ref(false);
const expedienteAEditar = ref(null);

const abrirModalEditar = (item) => {
    expedienteAEditar.value = item;
    modalNuevoAbierto.value = true;
};

// === ESTADOS GLOBALES ===
const loading = ref(true);
const listaExpedientes = ref([]);
const usuarioActual = ref(null);
const rolUsuario = ref(null);

const areasUsuario = ref([]);
const seccionSeleccionada = ref(null);
const miSeccion = ref(null);
const filtroEstatus = ref("Todos");
const vistaActual = ref("entrada");
const registroResaltado = ref(null);

const anioActual = new Date().getFullYear();
const opcionesAnios = ref(Array.from({ length: 8 }, (_, i) => anioActual - i));
const filtroAnio = ref(anioActual);

// === CATÁLOGO GLOBAL DE DEPENDENCIAS ===
const catalogoDependencias = ref([]);

const cargarCatalogoDependenciasGlobal = async () => {
    try {
        catalogoDependencias.value = await inventarioService.cargarCatalogoDependenciasGlobal();
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
    filtroEstatus.value = "Todos";
    await cargarBandeja();
};

// === ESTADOS PARA PREVISUALIZACIÓN RÁPIDA DE PDF ===
const modalPreviewAbierto = ref(false);
const rutaPreview = ref('');
const cargandoPreviewId = ref(null);

const verPrimerPDF = async (idExpediente) => {
    cargandoPreviewId.value = idExpediente;
    try {
        const ruta = await inventarioService.obtenerPrimerPDFExpediente(idExpediente);
        if (ruta) {
            rutaPreview.value = ruta;
            modalPreviewAbierto.value = true;
        } else {
             toast.info("No se encontró un documento PDF principal para este expediente.");
        }
    } catch (error) {
        console.error("Error al obtener preview PDF:", error);
        toast.error("No se pudo cargar la vista previa.");
    } finally {
        cargandoPreviewId.value = null;
    }
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
const registrosPorPagina = ref(25); //si se cambia este valor tambien modificarlo en el toggleVerTodos

watch([filtroEstatus, filtroAnio, seccionSeleccionada, vistaActual], () => {
    paginaActual.value = 1;
    filtroSerieSeleccionada.value = ""; // Limpia el filtro avanzado automáticamente si cambiamos de vista
});

const totalPaginas = computed(() => {
    if (registrosPorPagina.value === 0) return 1;
    return Math.ceil(expedientesFiltrados.value.length / registrosPorPagina.value) || 1;
});

const expedientesPaginados = computed(() => {
    if (registrosPorPagina.value === 0) return expedientesFiltrados.value;

    const inicio = (paginaActual.value - 1) * registrosPorPagina.value;
    const fin = inicio + registrosPorPagina.value;
    return expedientesFiltrados.value.slice(inicio, fin);
});

const irAPagina = (pag) => {
    if (pag >= 1 && pag <= totalPaginas.value) {
        paginaActual.value = pag;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
const toggleVerTodos = () => {
    if (registrosPorPagina.value === 0) {
        registrosPorPagina.value = 25;
        paginaActual.value = 1;
    } else {
        registrosPorPagina.value = 0;
        paginaActual.value = 1;
    }
};

// === ESTADOS MODALES ===
const modalAtenderAbierto = ref(false);
const expedienteAAtender = ref(null);

const modalConcluirAbierto = ref(false);
const expedienteAConcluir = ref(null);
const catalogoSeriesEstructurado = ref([]);

const modalDetallesAbierto = ref(false);
const expedienteDetalle = ref(null);

const modalCancelarAbierto = ref(false);
const expedienteACancelar = ref(null);

const modalEdicionAdminAbierto = ref(false);
const expedienteAdmin = ref(null);

// === FLUJOS MODALES ===
const abrirModalAtender = (item) => { expedienteAAtender.value = item; modalAtenderAbierto.value = true; };
const abrirModalConcluir = (item) => { expedienteAConcluir.value = item; modalConcluirAbierto.value = true; };
const abrirModalDetalles = async (item) => { expedienteDetalle.value = item; modalDetallesAbierto.value = true; };
const abrirModalCancelar = (item) => { expedienteACancelar.value = item; modalCancelarAbierto.value = true; };
const abrirModalEdicionAdmin = (item) => { expedienteAdmin.value = item; modalEdicionAdminAbierto.value = true; };

// === COMPUTADOS ===
// Extrae y agrupa las series/subseries únicas de la bandeja actual
const seriesDisponiblesEnBandeja = computed(() => {
    const seriesMap = new Map();
    
    listaExpedientes.value.forEach(exp => {
        const cadido = exp.snapshot_cadido;
        // Verificamos que tenga los datos completos del padre y de la subserie
        if (cadido && cadido.codigo_subserie && cadido.codigo_padre) {
            
            // Si la serie padre no existe en el mapa, la creamos
            if (!seriesMap.has(cadido.codigo_padre)) {
                seriesMap.set(cadido.codigo_padre, {
                    codigo_serie: cadido.codigo_padre,
                    nombre_serie: cadido.nombre_padre || 'Serie',
                    subseriesMap: new Map() // Sub-mapa para evitar subseries duplicadas
                });
            }
            
            // Extraemos la serie del mapa y le agregamos la subserie
            const serie = seriesMap.get(cadido.codigo_padre);
            if (!serie.subseriesMap.has(cadido.codigo_subserie)) {
                serie.subseriesMap.set(cadido.codigo_subserie, {
                    codigo_subserie: cadido.codigo_subserie,
                    nombre_subserie: cadido.nombre_subserie
                });
            }
        }
    });
    
    // Convertimos los mapas en arreglos para Vue y ordenamos alfabéticamente
    return Array.from(seriesMap.values()).map(serie => ({
        codigo_serie: serie.codigo_serie,
        nombre_serie: serie.nombre_serie,
        // Ordenamos las subseries
        subseries: Array.from(serie.subseriesMap.values())
                        .sort((a, b) => a.codigo_subserie.localeCompare(b.codigo_subserie))
    })).sort((a, b) => a.codigo_serie.localeCompare(b.codigo_serie)); // Ordenamos las series padre
}); 

const expedientesFiltrados = computed(() => {
    let filtrados = listaExpedientes.value;

    // 1. Filtro base por Estatus
    if (filtroEstatus.value !== "Todos") {
        filtrados = filtrados.filter(exp => exp.estatus === filtroEstatus.value);
    }

    // 2. Filtro Avanzado (Serie/Subserie)
    if (filtroSerieSeleccionada.value) {
        filtrados = filtrados.filter(exp => 
            exp.snapshot_cadido && 
            exp.snapshot_cadido.codigo_subserie === filtroSerieSeleccionada.value
        );
    }

    return filtrados;
});

// UTILIDAD PARA ARREGLOS DE BD
const obtenerValorArreglo = (valor) => {
    if (!valor) return "";
    if (Array.isArray(valor)) return valor[0];
    if (typeof valor === "string") return valor.replace(/[[\]"{}]/g, "").trim();
    return valor;
};

// === CARGAS DE BASE DE DATOS (REFACTORIZADA) ===
const inicializarUsuario = async () => {
    try {
        const { userData } = await inventarioService.inicializarUsuario();
        usuarioActual.value = userData.id;
        rolUsuario.value = userData.rol;

        await cargarCatalogoDependenciasGlobal();

        areasUsuario.value = await inventarioService.obtenerAreasUsuario(userData.rol, userData.secciones_permitidas);

        if (areasUsuario.value.length > 0) {
            seccionSeleccionada.value = areasUsuario.value[0].id;
            await cargarBandeja();
        } else {
            loading.value = false;
        }
    } catch (error) {
        console.error("Error inicializando:", error);
        toast.error("Error al inicializar sesión.");
        loading.value = false;
    }
};

const cargarBandeja = async () => {
    if (!seccionSeleccionada.value) return;
    loading.value = true;

    miSeccion.value = areasUsuario.value.find((a) => a.id === seccionSeleccionada.value);

    try {
        // 1. Cargar expedientes
        listaExpedientes.value = await inventarioService.cargarBandeja(
            filtroAnio.value, 
            seccionSeleccionada.value, 
            vistaActual.value
        );

        // 2. Cargar series para conclusión
        catalogoSeriesEstructurado.value = await inventarioService.cargarSeriesParaConclusion(seccionSeleccionada.value);
        
    } catch (error) {
        console.error(error);
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

const formatFechaHora = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("es-MX", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const abrirModalNuevoInterno = () => {
    if (!seccionSeleccionada.value) {
        return toast.error("Selecciona un área en la cabecera primero.");
    }
    expedienteAEditar.value = null;
    modalNuevoAbierto.value = true;
};

const onRegistroInternoExitoso = async (idsInsertados) => {
    modalNuevoAbierto.value = false;
    
    // 1. Recargamos la información (Skeletons aparecen y luego desaparecen)
    await cargarBandeja();           

    if (idsInsertados && Array.isArray(idsInsertados) && idsInsertados.length > 0) {
        const idVisible = idsInsertados.find(id => expedientesPaginados.value.some(exp => exp.id === id));

        if (idVisible) {
            registroResaltado.value = idVisible;
            
            // 2. Esperamos a que Vue inyecte el HTML real en lugar de los skeletons
            await nextTick();
            
            // 3. TRUCO: Le damos 150ms al navegador para que calcule las alturas y posiciones (Layout/Paint)
            setTimeout(() => {
                const elemento = document.getElementById(`expediente-${idVisible}`);
                if (elemento) {
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);

            // 4. Quitamos el resplandor después de 3 segundos
            setTimeout(() => {
                if (registroResaltado.value === idVisible) {
                    registroResaltado.value = null;
                }
            }, 3000);
        }
    }
};

// == FILTRO AVANZADO ==
const menuFiltrosAbierto = ref(false);
const filtroAvanzadoAbierto = ref(false);
const filtroSerieSeleccionada = ref("");

// == EXPORTACIÓN ===
const modalExportarAbierto = ref(false);
const abrirModalExportar = () => {
    if (!seccionSeleccionada.value) return toast.error("Selecciona un área en la cabecera primero.");
    modalExportarAbierto.value = true;
};

const modalExportarPDFAbierto = ref(false);
const abrirModalExportarPDF = () => {
    if (!seccionSeleccionada.value) return toast.error("Selecciona un área en la cabecera primero.");
    modalExportarPDFAbierto.value = true;
};

const claseBadgeCaracter = (caracter) => {
    const c = (caracter || '').toLowerCase()
    const clasesBase = "ml-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border mb-0.5 "

    if (c.includes('urgente')) return clasesBase + "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800"
    if (c.includes('extraordinario') || c.includes('extra')) return clasesBase + "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-purple-200 dark:border-purple-800"
    return clasesBase + "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
}

const badgeColor = (estatus) => {
    switch (estatus) {
        case "Recepcionado": return "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300 border border-blue-300 dark:border-blue-600";
        case "En trámite": return "bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300 border border-amber-300 dark:border-amber-600";
        case "Concluido": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600";
        case "Cancelado": return "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300 border border-red-300 dark:border-red-600";
        default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/80 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
    }
};

const handleAtajosTeclado = (e) => {
    if (e.ctrlKey && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault(); 
        if (!modalNuevoAbierto.value) abrirModalNuevoInterno();
    }
};

onMounted(() => {
    inicializarUsuario();
    window.addEventListener('keydown', handleAtajosTeclado);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleAtajosTeclado);
});
</script>