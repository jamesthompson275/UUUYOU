export default class {
    constructor(position = "bottom-center") {
        this.snackbar = document.getElementById("snackbar");
        this.position = position;
        switch(this.position) {
            case "bottom-center":
                this.snackbar.style.bottom = "20px";
                this.snackbar.style.left = 0;
                this.snackbar.style.right = 0;
            default:
                this.snackbar.style.bottom = "20px";
        }
    }

    show = () => {
        this.snackbar.style.opacity = 1;
    }

    hide = () => {
        this.snackbar.style.opacity = 0;
    }
}
