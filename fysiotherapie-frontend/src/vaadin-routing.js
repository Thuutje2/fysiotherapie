import "./components/patient-hoofdpagina.js";
import "./components/patient-information.js";
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
    }
]).then(() => {
    console.log('Routes mapped successfully');
});

