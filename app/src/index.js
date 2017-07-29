import "./styles/index.scss";
import { Snackbar } from "./components";

const start = () => {
    const snackbar = new Snackbar();
    snackbar.show();
};

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
