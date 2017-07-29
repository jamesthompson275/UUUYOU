import "./styles/index.scss";
import { Snackbar } from "./components";
import { NewMap } from "./js/GoogleMap";

const start = () => {
    const snackbar = new Snackbar();
    snackbar.show();
    const mapContainer = document.createElement("div");
    document.body.appendChild(mapContainer);
    NewMap(mapContainer, {
        width: 600,
        height: 600,
        options: {
            zoom: 10,
            center: {
                lat: -27.4697707,
                lng: 153.0251235
            }
        }
    });
}

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
