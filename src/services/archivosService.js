// src/services/archivosService.js
import { supabase } from '../supabase.js'

export const archivosService = {
  /**
   * Obtiene la lista de archivos anexos de un grupo específico.
   */
  async obtenerArchivosAnexos(grupoId) {
    const { data, error } = await supabase
      .from('archivos_anexos')
      .select('*')
      .eq('id_grupo', grupoId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Sube el archivo al Storage y registra su metadata en la base de datos.
   */
  async subirArchivo(file, grupoId, expedienteId) {
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Subir a Storage
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const rutaStorage = `${grupoId}/${Date.now()}_${cleanFileName}`

    const { error: uploadError } = await supabase.storage
      .from('expedientes')
      .upload(rutaStorage, file)

    if (uploadError) throw uploadError

    // 2. Registrar en Base de Datos
    const { error: dbError } = await supabase
      .from('archivos_anexos')
      .insert([{
        id_expediente: expedienteId,
        id_grupo: grupoId,
        nombre_archivo: file.name,
        tipo_mime: file.type,
        tamano_bytes: file.size,
        ruta_supabase: rutaStorage,
        id_usuario_subida: user?.id
      }])

    if (dbError) throw dbError
  },

  /**
   * Genera una URL firmada de 1 hora para previsualizar el documento.
   */
  async obtenerUrlFirmada(rutaSupabase) {
    const { data, error } = await supabase.storage
      .from('expedientes')
      .createSignedUrl(rutaSupabase, 3600)

    if (error) throw error
    return data.signedUrl
  },

  /**
   * Descarga el Blob del archivo desde el Storage.
   */
  async descargarBlob(rutaSupabase) {
    const { data, error } = await supabase.storage
      .from('expedientes')
      .download(rutaSupabase)

    if (error) throw error
    return data
  },

  /**
   * Elimina el archivo físico del Storage y su registro en la BD.
   */
  async eliminarArchivoCompleto(archivoId, rutaSupabase) {
    // 1. Eliminar de Storage
    const { error: storageError } = await supabase.storage
      .from('expedientes')
      .remove([rutaSupabase])
        
    if (storageError) throw storageError

    // 2. Eliminar de Base de Datos
    const { error: dbError } = await supabase
      .from('archivos_anexos')
      .delete()
      .eq('id', archivoId)

    if (dbError) throw dbError
  }
}