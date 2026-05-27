<template>
  <div class="fade-in space-y-6 pb-10">

    <!-- Encabezado de Bienvenida -->
    <div class="bg-blue-900 rounded-2xl p-8 shadow-lg text-white">
      <h1 class="text-3xl font-bold mb-2">¡Bienvenido al SIA!</h1>
      <p class="text-blue-100 text-lg">Sistema Integral de Archivos. Selecciona un módulo en el menú lateral para
        comenzar tu jornada.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- COLUMNA PRINCIPAL: Noticias Relevantes (Ocupa 2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
            </path>
          </svg>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">Noticias Relevantes</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Tarjeta Noticia 1 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full mb-3 inline-block">
              27 MAY 2026
            </span>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full mb-3 inline-block">Actualización</span>

            <h3 class="text-md font-bold text-gray-900 dark:text-white mb-2">Nuevo Catálogo CADIDO</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Se han actualizado los valores documentales en el
              sistema. Por favor revisa el módulo CADIDO para consultar los nuevos plazos de conservación.</p>
          </div>

          <!-- Tarjeta Noticia 2 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full mb-3 inline-block">
              27 MAY 2026
            </span>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full mb-3 inline-block">Aviso
              Institucional</span>
            <h3 class="text-md font-bold text-gray-900 dark:text-white mb-2">Jornada de Archivo de Trámite</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Te recordamos que el próximo 1 de julio se
              realiza la revisión de inventarios y transferencias primarias.</p>
          </div>
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                </path>
              </svg>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">Últimas Noticias</h2>
            </div>

            <!-- Estado de Carga RSS -->
            <div v-if="loadingRss" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="i in 4" :key="i"
                class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                <div class="h-5 w-24 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-3"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mb-1"></div>
                <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>

            <!-- Noticias Reales RSS -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a v-for="(noticia, index) in noticiasRss" :key="index" :href="noticia.link" target="_blank"
                class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-800 dark:hover:border-blue-500 transition-all group flex flex-col justify-between">
                <div>
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full mb-3 inline-block">
                    {{ formatearFecha(noticia.pubDate) }}
                  </span>
                  <h3
                    class="text-md font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {{ noticia.title }}
                  </h3>
                  <!-- Extraemos un fragmento limpio de la descripción -->
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 text-ellipsis overflow-hidden"
                    v-html="noticia.description"></p>
                </div>
                <div class="mt-4 text-xs font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-1">
                  Leer artículo completo
                  <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMNA LATERAL: Clima y Enlaces (Ocupa 1/3) -->
      <div class="space-y-6">

        <!-- WIDGET DEL CLIMA -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          <div class="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5">
            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.758a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z">
              </path>
            </svg>
          </div>
          <div class="p-6 relative z-10">
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">El Clima Hoy
            </h3>
            <div class="flex justify-between items-end">
              <div>
                <!-- Estado de Carga -->
                <div v-if="loadingClima" class="animate-pulse flex flex-col gap-2">
                  <div class="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                </div>
                <!-- Datos Reales -->
                <div v-else>
                  <span class="text-4xl font-black text-gray-800 dark:text-white">{{ climaActual.temperatura }}°C</span>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">Chilpancingo, Gro.</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Viento: {{ climaActual.viento }} km/h</p>
                </div>
              </div>
              <div class="text-amber-500">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- WIDGET ENLACES DE INTERÉS -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Enlaces Oficiales
          </h3>

          <div class="space-y-3">
            <a href="https://guerrero.gob.mx/" target="_blank"
  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
  <div
    class="p-2 bg-gray-100 dark:bg-gray-900 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
    <!-- Ajuste de tamaño con w-8 h-8 y object-contain para evitar deformaciones -->
    <img src="https://www.guerrero.gob.mx/wp-content/themes/guerrero2022/img/logoGuerreroEscudo.png" 
         alt="Logo Gobierno de Guerrero" 
         class="w-12 h-12 object-contain">
  </div>
  <div>
    <p class="text-sm font-bold text-gray-800 dark:text-gray-200">Gobierno de Guerrero</p>
    <p class="text-xs text-gray-500 dark:text-gray-400">Sitio web oficial</p>
  </div>
</a>

            <!-- Redes Sociales -->
            <div class="flex gap-3 pt-2">
              <a href="https://www.facebook.com/GobiernoGuerrero" target="_blank"
                class="flex-1 flex justify-center items-center gap-2 p-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-lg transition-colors font-semibold text-sm">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
              <a href="https://twitter.com/Gob_Guerrero" target="_blank"
                class="flex-1 flex justify-center items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-semibold text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter)
              </a>


            </div>
          </div>
        </div>

        <div>
          <!-- WIDGET FACEBOOK -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center overflow-hidden">
            <h3
              class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 w-full text-left">
              Actividad Reciente</h3>

            <!-- Contenedor extra para forzar el centrado del iframe de Facebook -->
            <div class="w-full flex justify-center">
              <div class="fb-page" data-href="https://www.facebook.com/ConsejeriaGuerrero"
                data-tabs="timeline,events,messages" data-width="350" data-adapt-container-width="true"
                data-hide-cover="false" data-show-facepile="true">
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loadingClima = ref(true)
const climaActual = ref({
  temperatura: '--',
  viento: '--'
})

const noticiasRss = ref([])
const loadingRss = ref(true)

// Función para darle formato a la fecha en tu template
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

const obtenerClimaLocal = async () => {
  try {
    // Coordenadas de Chilpancingo de los Bravo, Gro (Lat: 17.5506, Lon: -99.5057)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=17.5506&longitude=-99.5057&current=temperature_2m,wind_speed_10m&timezone=America/Mexico_City'

    const response = await fetch(url)
    if (!response.ok) throw new Error('Error en la API del clima')

    const data = await response.json()

    // Redondeamos la temperatura para que no muestre decimales largos (ej: 28.4 -> 28)
    climaActual.value = {
      temperatura: Math.round(data.current.temperature_2m),
      viento: data.current.wind_speed_10m
    }
  } catch (error) {
    console.error('Error al obtener el clima:', error)
    climaActual.value = { temperatura: 'N/A', viento: 'N/A' }
  } finally {
    loadingClima.value = false
  }
}

// === LÓGICA DE FACEBOOK SDK ===
const cargarFacebookSDK = () => {
  // Si el SDK ya se cargó antes (ej. el usuario navegó a otra vista y regresó)
  if (window.FB) {
    window.FB.XFBML.parse() // Obligamos a Facebook a volver a dibujar el widget
    return
  }

  // Si es la primera vez, creamos el script y lo inyectamos
  const script = document.createElement('script')
  script.src = "https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v19.0"
  script.async = true
  script.defer = true
  script.crossOrigin = "anonymous"
  document.body.appendChild(script)
}

const obtenerRss = async () => {
  try {
    // Hacemos fetch a nuestro proxy en Vite, añadiendo la ruta del XML
    const response = await fetch('/api-proceso/rss/feed.html?r=1')
    if (!response.ok) throw new Error('Error al obtener el feed')

    // Obtenemos la respuesta como texto (XML puro)
    const textData = await response.text()

    // Convertimos el texto XML en un objeto navegable
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(textData, 'text/xml')

    // Al ser un feed Atom, las noticias están dentro de <entry>
    const entries = xmlDoc.querySelectorAll('entry')

    // Mapeamos los primeros 4 resultados
    noticiasRss.value = Array.from(entries).slice(0, 4).map(entry => {
      // textContent extrae el texto ignorando las etiquetas CDATA
      const title = entry.querySelector('title')?.textContent || 'Sin título'

      // En Atom, el enlace viene como un atributo href dentro de <link>
      const link = entry.querySelector('link')?.getAttribute('href') || '#'
      const pubDate = entry.querySelector('updated')?.textContent || ''
      const description = entry.querySelector('content')?.textContent || ''

      return { title, link, pubDate, description }
    })

  } catch (error) {
    console.error('Error al parsear las noticias:', error)
  } finally {
    loadingRss.value = false
  }
}

onMounted(() => {
  obtenerClimaLocal()
  cargarFacebookSDK()
  obtenerRss()
})
</script>