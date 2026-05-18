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
      <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">SIA - CJ</h2>
      
      <form @submit.prevent="iniciarSesion" class="space-y-4 text-left">
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            placeholder="usuario@ejemplo.com"
          >
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="cargando"
          class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 duration-300 flex items-center justify-center"
        >
          <span v-if="cargando" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Iniciando sesión...
          </span>
          <span v-else>
            Ingresar al Sistema
          </span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          ¿No tienes acceso? <br/>
          <span class="font-medium text-gray-700 dark:text-gray-300">Si no estás registrado, contacta al administrador del sistema.</span>
        </p>
      </div>
    </div>

    <div class="absolute bottom-6 text-center w-full z-0">
      <p class="text-xs text-gray-400 dark:text-gray-500 font-mono tracking-wide">
        v1.0 | Red Local
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const cargando = ref(false)

const iniciarSesion = async () => {
  try {
    cargando.value = true
    await authService.loginWithEmail(email.value, password.value)
    router.push('/')
    
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message)
    alert("Credenciales incorrectas. Verifica tu correo y contraseña.")
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