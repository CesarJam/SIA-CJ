import { supabase } from '@/supabase'

export const cuadroGeneralService = {
    
    // Obtener todos los registros ordenados por código
    async obtenerTodos() {
        const { data, error } = await supabase
            .from('cuadro_general')
            .select('*')
            .order('codigo', { ascending: true })

        if (error) throw error
        return data || []
    },

    // Insertar un nuevo registro
    async crearRegistro(datos) {
        const { data, error } = await supabase
            .from('cuadro_general')
            .insert([{
                codigo: datos.codigo.trim(),
                seccion: datos.seccion.trim(),
                funcion: datos.funcion
            }])

        if (error) throw error
        return data
    },

    // Actualizar un registro existente
    async actualizarRegistro(id, datos) {
        const { data, error } = await supabase
            .from('cuadro_general')
            .update({ 
                seccion: datos.seccion.trim(), 
                funcion: datos.funcion 
            })
            .eq('id', id)

        if (error) throw error
        return data
    },

    // Eliminar un registro por ID
    async eliminarRegistro(id) {
        const { error } = await supabase
            .from('cuadro_general')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}