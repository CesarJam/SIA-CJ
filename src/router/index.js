import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService'
import Registro from '@/views/Registro.vue'
import RecuperarPassword from '@/views/RecuperarPassword.vue'

const Login = () => import('../views/Login.vue')
const Denegado = () => import('../views/Denegado.vue')
const Dashboard = () => import('../views/Dashboard.vue')


// Vistas "Hijas" del Dashboard
const Home = () => import('../views/modules/Home.vue')
const Usuarios = () => import('../views/modules/Usuarios.vue')
const CuadroGeneral = () => import('../views/modules/CuadroGeneral.vue')

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresGuest: true }
    },
    {
    path: '/registro',
    name: 'Registro',
    component: Registro,
    // Si usas guards (meta: { requiresAuth: false }), agrégalos aquí
    meta: { requiresAuth: false } 
    },
    {
        path: '/denegado',
        name: 'Denegado',
        component: Denegado
    },
    {
    path: '/recuperar-password',
    name: 'RecuperarPassword',
    component: RecuperarPassword,
    meta: { requiresAuth: false } 
    },
    {
        path: '/',
        component: Dashboard,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Home',
                component: Home
            },
            {
                path: 'usuarios',
                name: 'Usuarios',
                component: Usuarios
            },
            {
                path: 'cuadro-general',
                name: 'CuadroGeneral',
                component: CuadroGeneral
            },
            {
                path: 'series', 
                name: 'Series',
                component: () => import('../views/modules/Series.vue'), 
                meta: { requiresAuth: true }
            },
            {
                path: 'cadido',
                name: 'Cadido',
                component: () => import('../views/modules/Cadido.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'oficialia',
                name: 'Oficialia',
                component: () => import('../views/modules/Oficialia.vue'), 
                meta: { 
                    requiresAuth: true,
                    requiresOficialia: true
                 }
            },
            {
                path: 'inventario', 
                name: 'Inventario',
                component: () => import('../views/modules/Inventario.vue'),
                meta: { requiresAuth: true }
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

    const session = await authService.getSession()

    if (requiresAuth) {
        if (!session) {
            next({ name: 'Login' })
        } else {
            const userData = await authService.checkWhitelist(session.user.email)
            
            if (!userData) {
                await authService.logout()
                next({ name: 'Denegado' })
            } else {

                to.meta.userRole = userData.rol
                to.meta.userSecciones = userData.secciones_permitidas || []

                // === OFICIALÍA ===
                if (to.matched.some(record => record.meta.requiresOficialia)) {
                    const tieneAcceso = userData.rol === 'admin' || to.meta.userSecciones.includes('OFP')
                    
                    if (!tieneAcceso) {
                        console.warn("Acceso denegado a Oficialía: Falta de privilegios.")
                        return next({ name: 'Home' }) 
                    }
                }
                next()
            }
        }
    } else if (requiresGuest && session) {
        const userData = await authService.checkWhitelist(session.user.email)
        if (userData) {
            next({ name: 'Home' })
        } else {
            await authService.logout()
            next()
        }
    } else {
        next()
    }
})

export default router