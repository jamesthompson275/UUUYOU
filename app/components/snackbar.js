window.snackbar = class {
    constructor(
        position = "bottom-center",
        message = "Snackbar",
        duration = 2000,
        button1Click = () => this.hide(),
        button2Click = () => this.hide()) {

        this.position = position;
        this.duration = duration;
        
        this.snackbar = document.createElement("div");
        this.snackbar.setAttribute("id", "snackbar");
        this.snackbar.classList.add("snackbar");
        
        this.text = document.createElement("span");
        this.text.setAttribute("class", "snackbartext");
        this.text.appendChild(document.createTextNode(message));
        this.buttons = document.createElement("div");
        this.buttons.setAttribute("class", "snackbarbuttons");
        this.button1 = document.createElement("button");
        this.button1.setAttribute("class", "snackbarbutton");
        this.button1.appendChild(document.createTextNode("YES"));
        this.button1.addEventListener("click", button1Click);
        this.button2 = document.createElement("button");
        this.button2.setAttribute("class", "snackbarbutton");
        this.button2.appendChild(document.createTextNode("NO"));
        this.button2.addEventListener("click", button2Click);
        this.buttons.appendChild(this.button1);
        this.buttons.appendChild(this.button2);
        this.snackbar.appendChild(this.text);
        this.snackbar.appendChild(this.buttons);
        
        const root = document.getElementById("root");
        root.appendChild(this.snackbar);
        
        switch(this.position) {
            case "bottom-center":
                this.snackbar.classList.add(this.position);
                break;
            case "bottom-left":
                this.snackbar.classList.add(this.position);
                break;
            case "bottom-right":
                this.snackbar.classList.add(this.position);
                break;
            default:
                break;
        }
    }

    show() {
        this.snackbar.classList.add("show-bottom");
    }

    hide() {
        this.snackbar.classList.remove("show-bottom");
        setTimeout(() => {
            const root = document.getElementById("root");
            root.removeChild(this.snackbar);
        })
    }
}
