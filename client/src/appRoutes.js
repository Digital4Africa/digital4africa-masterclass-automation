import { lazy } from "react"

import LandingPage from "./pages/Landing"
const LoginPage = lazy(()=>import("./pages/LoginPage"))
const AdminHomePage = lazy(() =>import("./pages/AdminPage"))



export const appRoutes = [
	{ path: "/", component: LandingPage },
	{ path: "/admin-067", component: LoginPage },
	{ path: "/admin-home", component: AdminHomePage },
	{ path: "/admin-home/masterclasses", component: AdminHomePage },
	{ path: "/admin-home/students", component: AdminHomePage },


	// {path: "*", component: NotFound}

]
