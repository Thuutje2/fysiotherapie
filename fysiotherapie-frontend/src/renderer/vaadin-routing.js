import "./src/components/page/patient-dashboard.js";
import "./src/components/page/patient-details.js";
import "./src/components/page/patient-history.js";
import "./src/components/page/login-form.js";
import "./src/components/page/physio-dashboard.js";
import "./src/components/page/physio-patient-overview.js";
import "./src/components/page/physio-patient-details.js";
import "./src/components/page/physio-measurement-graphs.js";
import "./src/components/page/patient-measurement-graphs.js";
import "./src/components/page/physio-measurement-compare.js";

import {Router} from "@vaadin/router";
import AuthService from "./src/service/auth-service.js";
import {ROLE_ADMIN, ROLE_USER} from "./src/assets/userRoles.js";

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
        path: "/patient-dashboard",
        component: "patient-dashboard",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN, ROLE_USER]);
        },
    },
    {
        path: "/patient-details",
        component: "patient-details",
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
    {
        path: '/patient-measurement-graphs/treatments/:treatmentId/measurements/:measurementId',
        component: "patient-measurement-graphs",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_USER]);
        },
    },
    ////////////////////////////////////////////////////////////////////////
    //    ADMIN = INGELOGD                                                //
    ////////////////////////////////////////////////////////////////////////
    {
        path: "/physio-dashboard",
        component: "physio-dashboard",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        }
    },
    {
        path: "/physio-patient-overview",
        component: "physio-patient-overview",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        },
    },
    {
        path: "/physio-patient-details/:patientId",
        component: "physio-patient-details",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        },
    },
    {
        path: '/physio-measurement-graphs/patients/:patientId/treatments/:treatmentId/measurements/:measurementId',
        component: "physio-measurement-graphs",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN]);
        },
    },
    {
        path: '/physio-measurement-compare/patients/:patientId/treatments/:treatmentId/compare/:measurementId1/:measurementId2',
        component: "physio-measurement-compare",
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
        path: "/physio-patient-overview",
        component: "physio-patient-overview",
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
        return commands.redirect("/login");
    }
}

