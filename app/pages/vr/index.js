const start = async () => {
    let list;

    try {
        const data = await fetch("http://greensland.space/parkItems?lat=-27.38142559&lng=153.040722");
        const json = await data.json();
        console.log(json.slice(0,100));
        list = json.slice(0,100).map((item) => ({
            lat: item.latitude,
            lng: item.longitude
        }))

    } catch(err) {
        console.log(err);
    }

    const normalList = list.map((item) => `${Math.sin(item.lat)*Math.sin(item.lng) * 10} 0 ${Math.sin(item.lat)*Math.cos(item.lng) * 10}`);

    const scene = document.getElementById("scene");
    for(let item of normalList) {
        const box = document.createElement("a-box");
        box.setAttribute("position", item);
        box.setAttribute("rotation", "0 45 0");
        box.setAttribute("color", "red");
        scene.appendChild(box);
    }
}

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
