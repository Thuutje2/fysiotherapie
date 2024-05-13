import "./components/patient-hoofdpagina.js";
import "./components/patient-information.js";
import "./components/patient-history.js";
import "./components/activity-walk.js";
import "./components/login-form.js";

import {Router} from "@vaadin/router";
import AuthService from "./service/auth-service.js";
import {ADMIN_ROLE, USER_ROLE} from "./assets/userRoles.js";

const outlet = document.querySelector("#app")
const router = new Router(outlet)

router.setRoutes([
    {
        path: "/login",
        component: "login-form"
    },

    ////////////////////////////////////////////////////////////////////////
    //    PATIENT = INGELOGD                                              //
    ////////////////////////////////////////////////////////////////////////
    {
        path: "/patient",
        component: "patient-hoofdpagina",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ADMIN_ROLE, USER_ROLE]);
        },
    },

    {
        path: "/patient-information",
        component: "patient-information",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ADMIN_ROLE, USER_ROLE]);
        },
    },

    {
        path: "/patient-history",
        component: "patient-history",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ADMIN_ROLE, USER_ROLE]);
        },
    },
    {
        path: "/activity-walk",
        component: "activity-walk",
        action: async (context, commands) => {
            return await protectedContentRedirect(commands, [ADMIN_ROLE, USER_ROLE]);
        },
    },
    ////////////////////////////////////////////////////////////////////////
    //    ADMIN = INGELOGD                                                //
    ////////////////////////////////////////////////////////////////////////




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

]).then(() => {
    console.log('Routes mapped successfully');
});

async function protectedContentRedirect(commands, allowedRoles) {
    try {
        // get current logged in status and role
        const userRole = AuthService.getUserRole();
        const loggedIn = AuthService.isLoggedIn();
        AuthService.handleNavbarVisibility();


        if (!loggedIn || !allowedRoles.includes(userRole)) {
            return commands.redirect("/login");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return commands.redirect("./login");
    }
}

