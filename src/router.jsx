import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import LandingPage from './landing/LandingPage.jsx'
import SDPage from './landing/SDPage.jsx'
import CLPage from './landing/CLPage.jsx'
import SRDPage from './landing/SRDPage.jsx'
import BlogPage from './blog/BlogPage.jsx'
import LoginPage from './login/LoginPage.jsx'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const sdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sd',
  component: SDPage,
})

const clRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cl',
  component: CLPage,
})

const srdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/srd',
  component: SRDPage,
})

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const routeTree = rootRoute.addChildren([indexRoute, sdRoute, clRoute, srdRoute, blogRoute, loginRoute])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})
