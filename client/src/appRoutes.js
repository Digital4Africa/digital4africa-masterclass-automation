import { lazy } from "react"

import LandingPage from "./pages/Landing"
const LoginPage = lazy(()=>import("./pages/LoginPage"))
const AdminHomePage = lazy(() =>import("./pages/AdminPage"))
const NotFound = lazy(() => import("./pages/NotFoundPage"))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"))



export const appRoutes = [
	{ path: "/", component: LandingPage },
	{ path: "/checkout/:cohortId", component: CheckoutPage },
	{ path: "/admin-067", component: LoginPage },
	{ path: "/admin-home", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/masterclasses", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/cohorts", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/students", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/masterclasses/new", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/masterclasses/:masterclassId/edit", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/payments", component: AdminHomePage, requireAuth: true },

	{path: "*", component: NotFound}

]
