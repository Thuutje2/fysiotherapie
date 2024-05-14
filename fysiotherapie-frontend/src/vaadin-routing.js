import "./components/patient-hoofdpagina.js";
import "./components/patient-information.js";
import "./components/patient-history.js";
import "./components/activity-walk.js";
import "./components/physio-history.js";


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
    },
    {
        path: "/activity-walk",
        component: "activity-walk",
    },
    {
        path: "/physio-history",
        component: "physio-history",
    }

]).then(() => {
    console.log('Routes mapped successfully');
});

