import { supabase } from '../supabase.js'

export const authService = {
  /**
   * Inicia sesión con Correo y Contraseña administrados por tu Supabase local.
   */
  async loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    
    if (error) throw error
    return data
  },

  /**
   * Cierra la sesión activa en el cliente y en el servidor.
   */
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Recupera la sesión actual almacenada localmente (localStorage).
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  /**
   * Verifica la Lista Blanca (Whitelist).
   * Cruza el email autenticado con la tabla 'usuarios' para obtener el rol.
   * @param {string} email - El correo del usuario autenticado.
   * @returns {Object|null} - Retorna los datos del usuario (id, rol, nombre) o null si no tiene acceso.
   */
  async checkWhitelist(email) {
    if (!email) return null

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.warn('Acceso denegado: Usuario no encontrado en la lista blanca.')
      return null
    }

    return data
  }
}