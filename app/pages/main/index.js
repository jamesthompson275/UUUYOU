const start = () => {
    const openSnackbar = document.getElementById("openSnackbar");
    openSnackbar.addEventListener("click", () => {
        const snackbar = new window.snackbar("bottom-right");
        snackbar.show();
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
