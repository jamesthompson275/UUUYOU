const start = async () => {
    try {
        const parkId = getParameterByName("park") ? getParameterByName("park") : "D0065";
        const data = await fetch(`http://greensland.space/parkItems?id='${parkId}'`);
        const json = await data.json();
        const list = json.map((item) => ({
            lat: item.latitude,
            lng: item.longitude,
            type: item.type
        }))

        const lats = list.map(x => Math.abs(x.lat));
        const lngs = list.map(x => x.lng);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        console.log("minLat", minLat);
        console.log("minLng", minLng);

        const camera = document.getElementById("camera");
        const plane = document.getElementById("plane");
        const width = (maxLat - minLat) * 100000;
        const height = (maxLng - minLng) * 100000;
        camera.setAttribute("position", `${width / 2} 0 ${height / 2}`);
        camera.setAttribute("wasd-controls", `acceleration: ${Math.sqrt(width ** 2 + height ** 2) / 10}`);
        plane.setAttribute("position", `${width / 2} 0 ${height / 2}`);
        plane.setAttribute("width", width);
        plane.setAttribute("height", height);

        const mappedList = list.map((item) => {
            const latTrans = (Math.abs(item.lat) - minLat);
            const lngTrans = (item.lng - minLng);
            return {
                position: `${latTrans * 100000} 0 ${lngTrans * 100000}`,
                type: item.type
            };
        });

        console.log(mappedList);

        const scene = document.getElementById("scene");
        for (let item of mappedList) {
            if (item.type.toLowerCase().indexOf("bench") >= 0) {
                const bench = document.createElement("a-obj-model");
                bench.setAttribute("position", item.position);
                bench.setAttribute("src", "#bench-obj");
                bench.setAttribute("mtl", "#bench-mtl");
                scene.appendChild(bench);
            } else if(item.type.toLowerCase().indexOf("swing") >= 0) {
                const swing = document.createElement("a-obj-model");
                swing.setAttribute("position", item.position);
                swing.setAttribute("rotation", "0 90 0");
                swing.setAttribute("src", "#swing-obj");
                swing.setAttribute("mtl", "#swing-mtl");
                swing.setAttribute("scale", "0.2 0.2 0.2");
                scene.appendChild(swing);
            } else if(item.type.toLowerCase().indexOf("fitness exercise") >= 0) {
                const swing = document.createElement("a-obj-model");
                swing.setAttribute("position", item.position);
                swing.setAttribute("src", "#gym-obj");
                swing.setAttribute("mtl", "#gym-mtl");
                swing.setAttribute("scale", "0.05 0.05 0.05");
                scene.appendChild(swing);
            } else if(item.type.toLowerCase().indexOf("path") >= 0) {

            } else {
                const box = document.createElement("a-box");
                box.setAttribute("position", item.position);
                box.setAttribute("rotation", "0 45 0");
                box.setAttribute("color", "red");
                scene.appendChild(box);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
