<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"></div>

    <aside :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col md:relative md:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    ]">


      <div class="p-6 text-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
        <img :src="userProfile.avatar" alt="Avatar"
          class="w-20 h-20 rounded-full mx-auto shadow-md border-2 border-indigo-500 p-0.5 object-cover" />
        <h2 class="mt-3 font-semibold text-gray-800 dark:text-white truncate px-2">
          Hola, {{ userProfile.name }}
        </h2>
        <span class="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">
          {{ userRole }}
        </span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        <router-link to="/"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          exact-active-class="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
            </path>
          </svg>
          Inicio
        </router-link>
        <router-link to="/cuadro-general"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
          Cuadro General
        </router-link>

        <router-link to="/series"
          class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
            </path>
          </svg>
          Series Documentales
        </router-link>
        <router-link to="/cadido"
          class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          CADIDO
        </router-link>
        <router-link to="/inventario"
          class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
            </path>
          </svg>
          Inventario
        </router-link>
        <router-link v-if="userRole === 'admin'" to="/oficialia"
          class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold">

          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
            </path>
          </svg>
          Oficialía de Partes
        </router-link>
        <router-link v-if="userRole === 'admin'" to="/usuarios"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
            </path>
          </svg>
          Usuarios
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          <img src="@/assets/logo-transparente.png" alt="Logo SIA" class="h-10 w-auto" />
          <div class="flex flex-col">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              SIA - CJ
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Sistema Integral de Archivos</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Consejería Jurídica</p>
          </div>
        </div>

        <button @click="cerrarSesion"
          class="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">

      <header
        class="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="@/assets/logo-transparente.png" alt="Logo SIA" class="h-8 w-auto" />
          <h1 class="text-md font-bold text-gray-800 dark:text-white leading-tight">
            SIA - Sistema Integral de Archivos
          </h1>
        </div>
        <button @click="isMobileMenuOpen = true"
          class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const route = useRoute()

// Estado responsivo
const isMobileMenuOpen = ref(false)

// Datos del usuario (con valores por defecto)
const userRole = ref(route.meta.userRole || 'cliente')
const userSecciones = ref(route.meta.userSecciones || [])
const userProfile = ref({
  name: 'Cargando...',
  avatar: 'https://ui-avatars.com/api/?name=Usuario&background=random'
})

// Cargar datos de la sesión al montar el componente
onMounted(async () => {
  try {
    const session = await authService.getSession()
    if (session?.user) {
      // Extraemos la foto y el nombre que Google le entrega a Supabase
      const metadata = session.user.user_metadata
      userProfile.value.name = metadata.full_name || metadata.name || session.user.email
      // Fallback si no hay avatar en Google
      userProfile.value.avatar = metadata.avatar_url || metadata.picture || `https://ui-avatars.com/api/?name=${userProfile.value.name}&background=random`
    }
  } catch (error) {
    console.error("Error al obtener la sesión en el Dashboard:", error)
  }
})

// Cerramos el menú móvil automáticamente al cambiar de ruta
router.afterEach(() => {
  isMobileMenuOpen.value = false
})

const cerrarSesion = async () => {
  try {
    await authService.logout()
    router.push('/login')
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
  }
}
</script>

<style scoped>
/* Animación de transición suave entre vistas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>