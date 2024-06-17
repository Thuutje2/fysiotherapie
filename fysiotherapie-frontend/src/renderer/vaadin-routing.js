import "./src/components/patient-main-page.js";
import "./src/components/patient-details-page.js";
import "./src/components/patient-history.js";
import "./src/components/login-form.js";
import "./src/components/physio-main-page.js";
import "./src/components/physio-patient-overview.js";
import "./src/components/physio-patient-details.js";
import "./src/components/physio-measurement-graphs.js";

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
        path: "/patient-main-page",
        component: "patient-main-page",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ROLE_ADMIN, ROLE_USER]);
        },
    },
    {
        path: "/patient-details-page",
        component: "patient-details-page",
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
        path: "/physio-main-page",
        component: "physio-main-page",
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
        return commands.redirect("./login");
    }
}
