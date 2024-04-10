import "./components/patient-hoofdpagina.js";
import {Router} from "@vaadin/router";

const outlet = document.querySelector("#app")
const router = new Router(outlet)

router.setRoutes([
    {
        path: "/",
        component: "patient-hoofdpagina"
    }
]).then(() => {
    console.log('Routes mapped successfully');
});