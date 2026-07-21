import { supabase } from "@/supabase";

export const inventarioService = {
  // 1. Obtener la sesión del usuario y sus permisos
  async inicializarUsuario() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;

    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("id, secciones_permitidas, rol")
      .eq("email", user.email)
      .single();

    if (userError) throw userError;
    return { user, userData };
  },

  // 2. Obtener el catálogo de dependencias globales
  async cargarCatalogoDependenciasGlobal() {
    const { data, error } = await supabase
      .from("dependencias")
      .select("id, nombre_oficial, siglas");

    if (error) throw error;
    return data || [];
  },

  // 3. Obtener las áreas (secciones) permitidas para el usuario
  async obtenerAreasUsuario(rol, seccionesPermitidas) {
    let querySec = supabase
      .from("cuadro_general")
      .select("id, codigo, seccion")
      .order("codigo");

    if (rol !== "admin") {
      if (!seccionesPermitidas || seccionesPermitidas.length === 0) {
        return []; // No tiene áreas permitidas
      }
      querySec = querySec.in("codigo", seccionesPermitidas);
    }

    const { data, error } = await querySec;
    if (error) throw error;
    return data || [];
  },

  // 4. Obtener los expedientes de la bandeja (Entrada o Enviados)
  async cargarBandeja(filtroAnio, seccionSeleccionada, vistaActual) {
    let query = supabase
      .from("expedientes")
      .select(
        "*, area_origen:id_seccion_registro (codigo, seccion), area_destino:id_seccion_turnada (codigo, seccion)",
      )
      .gte("fecha_registro", `${filtroAnio}-01-01`)
      .lte("fecha_registro", `${filtroAnio}-12-31`)
      .order("fecha_registro", { ascending: false })
      .order("hora_registro", { ascending: false });

    if (vistaActual === "entrada") {
      query = query
        .eq("id_seccion_turnada", seccionSeleccionada)
        .or(
          `id_seccion_registro.neq.${seccionSeleccionada},tipo_registro.eq.Recibido`,
        );
    } else {
      // MIS ENVIADOS
      query = query
        .eq("id_seccion_registro", seccionSeleccionada)
        .or(
          `id_seccion_turnada.neq.${seccionSeleccionada},tipo_registro.eq.Enviado`,
        );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // 5. Obtener el catálogo de series para el modal de concluir
  async cargarSeriesParaConclusion(seccionSeleccionada) {
    const { data, error } = await supabase
      .from("series")
      .select("id, codigo_serie, nombre, subseries")
      .eq("id_seccion", seccionSeleccionada)
      .order("codigo_serie");

    if (error) throw error;

    let structuredData = [];
    if (data) {
      data.forEach((seriePadre) => {
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
    return structuredData;
  },

  // 6. Previsualización rápida de PDF
  async obtenerPrimerPDFExpediente(idExpediente) {
    const { data, error } = await supabase
      .from("archivos_anexos")
      .select("ruta_supabase")
      .eq("id_expediente", idExpediente)
      .ilike("tipo_mime", "%pdf%")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 es "no rows returned"
      throw error;
    }
    return data?.ruta_supabase || null;
  },

  /**
   * ==== MODULO MODAL REGISTRO ====
   */

  /**
   * Obtiene los datos básicos del usuario necesarios para crear registros (como su nomenclatura).
   */
  async obtenerDatosUsuarioParaRegistro() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nomenclaturaExpedienteArea")
      .eq("email", user.email)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Carga los catálogos de dependencias y secciones en paralelo para mayor velocidad.
   */
  async obtenerCatalogosParaRegistro() {
    const [depRes, secRes] = await Promise.all([
      supabase
        .from("dependencias")
        .select("id, nombre_oficial, siglas")
        .eq("activo", true)
        .order("nombre_oficial"),
      supabase
        .from("cuadro_general")
        .select("id, codigo, seccion")
        .order("codigo"),
    ]);

    if (depRes.error) throw depRes.error;
    if (secRes.error) throw secRes.error;

    return { dependencias: depRes.data, secciones: secRes.data };
  },

  /**
   * Crea una nueva dependencia en el catálogo.
   */
  async crearDependencia(payload) {
    const { data, error } = await supabase
      .from("dependencias")
      .insert([payload])
      .select();
    if (error) throw error;
    return data;
  },

  /**
   * Inserta un lote (batch) de expedientes para el turnado a múltiples áreas.
   */
  async registrarExpedientesBatch(batchData) {
    const { data, error } = await supabase
      .from("expedientes")
      .insert(batchData)
      .select();
    if (error) throw error;
    return data;
  },

  /**
   * Actualiza un expediente específico durante la edición.
   */
  async actualizarExpedienteEdicion(id, payload) {
    const { data, error } = await supabase
      .from("expedientes")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data;
  },

  /**
   *  === Modal Atender ===
   */

  // Actualiza el estatus de un expediente a "En trámite" y asigna los datos físicos y responsables.
  async atenderExpediente(expedienteId, payload) {
    const { data, error } = await supabase
      .from("expedientes")
      .update(payload)
      .eq("id", expedienteId);

    if (error) throw error;
    return data;
  },

  /**
   * === Modal Concluir ===
   */

  // Actualiza el estatus de un expediente a "Concluido" y guarda su clasificación archivística (Snapshot).
  async concluirExpediente(expedienteId, payload) {
    const { data, error } = await supabase
      .from("expedientes")
      .update(payload)
      .eq("id", expedienteId);

    if (error) throw error;
    return data;
  },

  /**
   *  === Modal Cancelar ===
   */

  // Actualiza el estatus de un expediente a "Cancelado" y añade la nota de justificación.
  async cancelarExpediente(expedienteId, payload) {
    const { data, error } = await supabase
      .from("expedientes")
      .update(payload)
      .eq("id", expedienteId);

    if (error) throw error;
    return data;
  },

  /**
   *  === Modal Detalles ===
   */

  // Obtiene la información de múltiples dependencias basándose en un arreglo de IDs.
  async obtenerDependenciasPorIds(ids) {
    const { data, error } = await supabase
      .from("dependencias")
      .select("id, nombre_oficial, siglas")
      .in("id", ids)
      .order("nombre_oficial");

    if (error) throw error;
    return data || [];
  },

  // Obtiene el historial de movimientos (bitácora) de un expediente específico.
  async obtenerBitacoraPorExpediente(idExpediente) {
    const { data, error } = await supabase
      .from("bitacora_movimientos")
      .select(`*, usuario:id_usuario (nombre, email)`)
      .eq("id_expediente", idExpediente)
      .order("fecha_hora", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * === Modal Edicion Admin
   */

  // Obtiene el catálogo completo de dependencias activas.
  async obtenerDependenciasActivas() {
    const { data, error } = await supabase
      .from("dependencias")
      .select("id, nombre_oficial, siglas")
      .eq("activo", true)
      .order("nombre_oficial");

    if (error) throw error;
    return data || [];
  },

  /**
   * Aplica una corrección administrativa a un expediente (modo Super Admin)
   * y registra el movimiento en la bitácora automáticamente.
   */
  async aplicarCorreccionAdministrativa(
    expedienteId,
    payload,
    bitacoraPayload,
  ) {
    // 1. Actualizar expediente
    const { error: updateError } = await supabase
      .from("expedientes")
      .update(payload)
      .eq("id", expedienteId);

    if (updateError) throw updateError;

    // 2. Registrar en bitácora automáticamente
    const { error: bitacoraError } = await supabase
      .from("bitacora_movimientos")
      .insert([bitacoraPayload]);

    if (bitacoraError) throw bitacoraError;

    return true;
  },
};
