import { supabase } from '@/supabase'

export const oficialiaService = {
    // 1. Inicializar usuario y obtener el ID de la sección de Oficialía
    async inicializarContextoOficialia() {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('id, rol, secciones_permitidas')
            .eq('email', user.email)
            .single()

        if (userError) throw userError

        const codigoOficialia = 'OFP'
        let idSeccionOficialia = null

        // Si es admin o tiene permiso a la OFP, buscamos el ID de la sección
        if (userData.rol === 'admin' || (userData.secciones_permitidas && userData.secciones_permitidas.includes(codigoOficialia))) {
            const { data: sec, error: secError } = await supabase
                .from('cuadro_general')
                .select('id')
                .eq('codigo', codigoOficialia)
                .single()

            if (secError && secError.code !== 'PGRST116') throw secError // PGRST116 es "No rows returned"
            idSeccionOficialia = sec?.id || null
        }

        return { userData, idSeccionOficialia }
    },

    // 2. Obtener catálogo global de dependencias (para visualización)
    async cargarCatalogoDependenciasGlobal() {
        const { data, error } = await supabase
            .from('dependencias')
            .select('id, nombre_oficial, siglas')
            
        if (error) throw error
        return data || []
    },

    // 3. Cargar las series para el Modal de Edición Admin
    async cargarSeriesParaConclusion(idSeccionOficialia) {
        if (!idSeccionOficialia) return []

        const { data, error } = await supabase
            .from("series")
            .select("id, codigo_serie, nombre, subseries")
            .eq("id_seccion", idSeccionOficialia)
            .order("codigo_serie")

        if (error) throw error

        let structuredData = []
        if (data) {
            data.forEach((seriePadre) => {
                if (seriePadre.subseries && Array.isArray(seriePadre.subseries)) {
                    let subseriesWithParentInfo = seriePadre.subseries.map((sub) => ({
                        ...sub,
                        id_serie_padre: seriePadre.id,
                        codigo_serie_padre: seriePadre.codigo_serie,
                        nombre_serie_padre: seriePadre.nombre,
                    }))
                    structuredData.push({
                        id: seriePadre.id,
                        codigo_serie: seriePadre.codigo_serie,
                        nombre: seriePadre.nombre,
                        subseries: subseriesWithParentInfo,
                    })
                }
            })
        }
        return structuredData
    },

    // 4. Cargar la bandeja principal (Entrada o Enviados)
    async cargarBandeja(filtroAnio, idSeccionOficialia, vistaActual) {
        if (!idSeccionOficialia) return []

        let query = supabase
            .from('expedientes')
            .select(`*, area_destino:id_seccion_turnada (codigo, seccion), area_origen:id_seccion_registro (codigo, seccion)`)
            .gte("fecha_registro", `${filtroAnio}-01-01`)
            .lte("fecha_registro", `${filtroAnio}-12-31`)
            .order('fecha_registro', { ascending: false })
            .order('hora_registro', { ascending: false })

        if (vistaActual === "entrada") {
            query = query
                .eq('id_seccion_turnada', idSeccionOficialia)
                .or(`id_seccion_registro.neq.${idSeccionOficialia},tipo_registro.eq.Recibido`)
        } else {
            query = query
                .eq('id_seccion_registro', idSeccionOficialia)
                .or(`id_seccion_turnada.neq.${idSeccionOficialia},tipo_registro.eq.Enviado`)
        }

        const { data, error } = await query
        if (error) throw error
        return data || []
    },

    // 5. Cancelar expediente (Soft Delete)
    async cancelarExpediente(id, notaJustificacion, idUsuario) {
        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Cancelado',
                observaciones: notaJustificacion,
                id_usuario_actualizacion: idUsuario
            })
            .eq('id', id)

        if (error) throw error
        return true
    },

    // 6. Concluir expediente manualmente (Raro en Oficialía, pero implementado en el script)
    async concluirExpediente(id, idUsuario) {
        const { error } = await supabase
            .from('expedientes')
            .update({
                estatus: 'Concluido',
                id_usuario_actualizacion: idUsuario
            })
            .eq('id', id)

        if (error) throw error
        return true
    }
}