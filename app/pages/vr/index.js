const start = async () => {
    try {
        const data = await fetch("http://greensland.space/parkItems?id='D1979'");
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
        camera.setAttribute("position", `${(maxLat - minLat) * 50000} 0 ${(maxLng - minLng) * 50000}`);
        plane.setAttribute("position", `${(maxLat - minLat) * 50000} 0 ${(maxLng - minLng) * 50000}`);
        plane.setAttribute("width", (maxLat - minLat) * 100000);
        plane.setAttribute("height", (maxLng - minLng) * 100000);
        console.log((maxLat - minLat) * 10000);

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
                bench.setAttribute("rotation", "0 90 0");
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

const init = () => {
    start();
};

if (document.readyState != "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
