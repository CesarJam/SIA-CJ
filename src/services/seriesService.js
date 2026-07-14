import { supabase } from '@/supabase'

export const seriesService = {
    // 1. Obtener los datos del usuario actual (rol y secciones permitidas)
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

    // 2. Obtener las secciones permitidas para el filtro
    async obtenerSecciones(rol, seccionesPermitidas) {
        let querySec = supabase
            .from('cuadro_general')
            .select('id, codigo, seccion')
            .order('codigo')

        // Si no es admin, filtramos por sus secciones permitidas
        if (rol !== 'admin') {
            querySec = querySec.in('codigo', seccionesPermitidas || [])
        }

        const { data, error } = await querySec
        if (error) throw error
        return data || []
    },

    // 3. Obtener todas las series (el filtro visual se hace en el frontend)
    async obtenerSeries() {
        const { data, error } = await supabase
            .from('series')
            .select('*, cuadro_general(codigo, seccion)')
            .order('codigo_serie')

        if (error) throw error
        return data || []
    },

    // 4. Crear una nueva serie con sus subseries
    async crearRegistro(payload) {
        const { data, error } = await supabase
            .from('series')
            .insert([payload])

        if (error) throw error
        return data
    },

    // 5. Actualizar una serie existente
    async actualizarRegistro(id, payload) {
        const { data, error } = await supabase
            .from('series')
            .update(payload)
            .eq('id', id)

        if (error) throw error
        return data
    },

    // 6. Eliminar una serie
    async eliminarRegistro(id) {
        const { error } = await supabase
            .from('series')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}