import "./components/patient-mainpage.js";
import "./components/patient-information.js";
import "./components/patient-history.js";
import "./components/activity-walk.js";
import "./components/physio-history.js";
import "./components/physio-measurement.js";



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
    },
    {
        path: "/physio-measurement",
        component: "physio-measurement",
    },

]).then(() => {
    console.log('Routes mapped successfully');
});

