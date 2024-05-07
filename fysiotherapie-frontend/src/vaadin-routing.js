import "./components/patient-mainpage.js";
import "./components/patient-information.js";
import "./components/patient-history.js";

import {Router} from "@vaadin/router";

const outlet = document.querySelector("#app")
const router = new Router(outlet)

router.setRoutes([
    {
        path: "/",
        component: "patient-hoofdpagina"
    },

    {
        path: "/patient-information",
        component: "patient-information",
    },

    {
        path: "/patient-history",
        component: "patient-history",
    }
]).then(() => {
    console.log('Routes mapped successfully');
});

