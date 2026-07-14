import { supabase } from '@/supabase'

export const cadidoService = {
    // 1. Obtener contexto del usuario 
    async obtenerContextoUsuario() {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('secciones_permitidas, rol')
            .eq('email', user.email)
            .single()
            
        if (userError) throw userError
        return userData
    },

    // 2. Obtener secciones permitidas
    async obtenerSecciones(rol, seccionesPermitidas) {
        let querySec = supabase
            .from('cuadro_general')
            .select('id, codigo, seccion')
            .order('codigo')

        if (rol !== 'admin') {
            querySec = querySec.in('codigo', seccionesPermitidas || [])
        }

        const { data, error } = await querySec
        if (error) throw error
        return data || []
    },

    // 3. Obtener series para el catálogo
    async obtenerSeries() {
        const { data, error } = await supabase
            .from('series')
            .select('*, cuadro_general(codigo, seccion)')
            .order('codigo_serie')

        if (error) throw error
        return data || []
    },

    // 4. Actualizar específicamente el JSONB de subseries (Valoración CADIDO)
    async actualizarValoracionSubseries(idSerie, subseriesActualizadas) {
        const { error } = await supabase
            .from('series')
            .update({ subseries: subseriesActualizadas })
            .eq('id', idSerie)

        if (error) throw error
        return true
    }
}