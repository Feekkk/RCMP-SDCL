import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import LandingPage from './landing/LandingPage.jsx'
import BlogPage from './blog/BlogPage.jsx'

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

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
})

const routeTree = rootRoute.addChildren([indexRoute, blogRoute])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})
