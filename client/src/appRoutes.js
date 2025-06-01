import { lazy } from "react"

import LandingPage from "./pages/Landing"
const LoginPage = lazy(()=>import("./pages/LoginPage"))
const AdminHomePage = lazy(() =>import("./pages/AdminPage"))
const NotFound = lazy(() => import("./pages/NotFoundPage"))



export const appRoutes = [
	{ path: "/", component: LandingPage },
	{ path: "/admin-067", component: LoginPage },
	{ path: "/admin-home", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/masterclasses", component: AdminHomePage, requireAuth: true },
	{ path: "/admin-home/students", component: AdminHomePage, requireAuth: true },


	{path: "*", component: NotFound}

]
