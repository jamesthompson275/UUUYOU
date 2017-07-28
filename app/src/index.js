import "./styles/index.scss";

const start = () => {
    console.log("UUUYOU");
};

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
