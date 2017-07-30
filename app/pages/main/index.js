const start = () => {
    
}

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
