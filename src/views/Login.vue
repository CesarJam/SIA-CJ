<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 fade-in relative">
    
    <div class="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative z-10">
      
      <div class="flex justify-center mb-6">
        <div class="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
                      <img src="@/assets/logo-transparente.png" class="h-16 w-auto" alt="Logo">

        </div>
      </div>

      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
        Sistema Integral de Archivos
      </h1>
      <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">SIA - CJ</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 text-sm">
        Acceso exclusivo. Inicia sesión para verificar tu identidad.
      </p>
      
      <button 
        @click="iniciarSesion" 
        :disabled="cargando"
        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 duration-300 flex items-center justify-center"
      >
        <span v-if="cargando" class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Conectando...
        </span>
        <span v-else class="flex items-center gap-3">
          <svg class="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Acceder con Google
        </span>
      </button>

      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          ¿No tienes acceso? <br/>
          <span class="font-medium text-gray-700 dark:text-gray-300">Si no estás registrado, contacta al administrador del sistema.</span>
        </p>
      </div>
    </div>

    <div class="absolute bottom-6 text-center w-full z-0">
      <p class="text-xs text-gray-400 dark:text-gray-500 font-mono tracking-wide">
        v1.0 | git: cesarjam
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '../services/authService'

const cargando = ref(false)

const iniciarSesion = async () => {
  try {
    cargando.value = true
    await authService.loginWithGoogle()
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    alert("No se pudo iniciar sesión. Verifica tu conexión.")
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>