import { supabase } from '../supabase.js'

export const authService = {
  /**
   * Inicia el flujo de autenticación con Google OAuth.
   * Supabase redirigirá automáticamente a la URL proporcionada.
   */
  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirige al root o a una vista de "callback/loading"
        redirectTo: window.location.origin
      }
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
   * Esencial para persistencia de sesión y escenarios Lie-Fi (red inestable).
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  /**
   * Verifica la Lista Blanca (Whitelist).
   * Cruza el email autenticado con la tabla 'usuarios' para obtener el rol.
   * * @param {string} email - El correo del usuario autenticado en Google.
   * @returns {Object|null} - Retorna los datos del usuario (id, rol, nombre) o null si no tiene acceso.
   */
  async checkWhitelist(email) {
    if (!email) return null

    // Usamos .single() porque el email es UNIQUE. 
    // Si no lo encuentra, arroja un error que capturamos para denegar el acceso.
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