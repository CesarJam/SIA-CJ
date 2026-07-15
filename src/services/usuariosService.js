import { supabase } from '@/supabase'

export const usuariosService = {
    // 1. Obtener todos los usuarios
    async obtenerUsuarios() {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('nombre')

        if (error) throw error
        return data || []
    },

    // 2. Obtener el catálogo de secciones para los permisos
    async obtenerSecciones() {
        const { data, error } = await supabase
            .from('cuadro_general')
            .select('codigo, seccion')
            .order('codigo')

        if (error) throw error
        return data || []
    },

    // 3. Actualizar un usuario existente
    async actualizarUsuario(id, payload) {
        const { error } = await supabase
            .from('usuarios')
            .update(payload)
            .eq('id', id)

        if (error) throw error
        return true
    },

    // 4. Eliminar un usuario (Revocar acceso)
    async eliminarUsuario(id) {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}