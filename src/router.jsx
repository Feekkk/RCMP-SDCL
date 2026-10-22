import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import LandingPage from './landing/LandingPage.jsx'
import SDPage from './landing/SDPage.jsx'
import WelfarePage from './landing/WelfarePage.jsx'
import MedicalPage from './landing/MedicalPage.jsx'
import CLPage from './landing/CLPage.jsx'
import ParkingPage from './landing/ParkingPage.jsx'
import FoodCouponPage from './landing/FoodCouponPage.jsx'
import SRDPage from './landing/SRDPage.jsx'
import BlogPage from './blog/BlogPage.jsx'
import LoginPage from './login/LoginPage.jsx'
import DashboardPage from './dashboard/DashboardPage.jsx'
import AdminDashboard from './admin/Dashboard.jsx'
import ManageUser from './admin/ManageUser.jsx'

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

const sdWelfareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sd/welfare',
  component: WelfarePage,
})

const sdMedicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sd/medical',
  component: MedicalPage,
})

const clRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cl',
  component: CLPage,
})

const clParkingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cl/parking',
  component: ParkingPage,
})

const clFoodCouponRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cl/food-coupon',
  component: FoodCouponPage,
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

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
})

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: ManageUser,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  sdRoute,
  sdWelfareRoute,
  sdMedicalRoute,
  clRoute,
  clParkingRoute,
  clFoodCouponRoute,
  srdRoute,
  blogRoute,
  loginRoute,
  dashboardRoute,
  adminRoute,
  adminUsersRoute,
])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})
