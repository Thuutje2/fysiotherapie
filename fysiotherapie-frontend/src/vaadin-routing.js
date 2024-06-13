import "./components/patient-mainpage.js";
import "./components/patient-information.js";
import "./components/patient-history.js";
import "./components/activity-walk.js";
import "./components/login-form.js";
import "./components/physio-hoofdpagina.js";
import "./components/physio-history.js";
import "./components/physio-measurement.js";
import "./components/patient-overview.js";


import {Router} from "@vaadin/router";
import AuthService from "./service/auth-service.js";
import {ROLE_ADMIN, ROLE_USER} from "./assets/userRoles.js";

const outlet = document.querySelector("#app")
const router = new Router(outlet)

router.setRoutes([
    {
        path: "/login",
        component: "login-form",
    },

    ////////////////////////////////////////////////////////////////////////
    //    PATIENT = INGELOGD                                              //
    ////////////////////////////////////////////////////////////////////////
    {
        path: "/patient-hoofdpagina",
        component: "patient-hoofdpagina",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN, ROLE_USER]);
        },
    },
    {
        path: "/patient-information",
        component: "patient-information",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN, ROLE_USER]);
        },
    },
    {
        path: "/patient-history",
        component: "patient-history",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN, ROLE_USER]);
        },
    },
    ////////////////////////////////////////////////////////////////////////
    //    ADMIN = INGELOGD                                                //
    ////////////////////////////////////////////////////////////////////////
    {
        path: "/physio-hoofdpagina",
        component: "physio-hoofdpagina",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        }
    },
    {
        path: "/physio-history",
        component: "physio-history",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        }
    },
    {
        path: "/physio-measurement",
        component: "physio-measurement",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        }
    },
    {
        path: "/activity-walk",
        component: "activity-walk",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        },
    },



    ////////////////////////////////////////////////////////////////////////
    //    THE CATCH ALL:                                                  //
    ////////////////////////////////////////////////////////////////////////
    {
        name: "home-page-element-catchall", // doet niks impliciet
        path: "/", // standaard landingspage
        component: "login-form", // routeert naar login form component.
    },
    {
        name: "not-found-element-404", // doet niks impliciet
        path: "/404", // 404 must be last in this file
        component: "not-found",
    },
    {
        name: "catchall", // doet niks impliciet
        path: "/******************************************", // 404 must be last in this file
        component: "not-found",
    },
    {
        path: "/physio-history",
        component: "physio-history",
    },
    {
        path: "/physio-measurement",
        component: "physio-measurement",
    },
    {
        path: "/patient-overview",
        component: "patient-overview",
    },

]).then(() => {
    console.log('Routes mapped successfully');
});

async function protectedContentRedirect(commands, allowedRoles) {
    try {
        const userRole = AuthService.getSavedRole();
        const loggedIn = AuthService.isLoggedIn();
        const sidebar = document.querySelector("sidebar-component");
        if (sidebar) {
            sidebar._isLoggedIn = loggedIn;
        }

        if (!loggedIn || !allowedRoles.includes(userRole)) {
            return commands.redirect("/login");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return commands.redirect("./login");
    }
}

