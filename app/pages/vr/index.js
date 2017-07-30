const start = async () => {
    try {
        const data = await fetch("http://greensland.space/parkItems?id='D0863'");
        const json = await data.json();
        const list = json.map((item) => ({
            lat: item.latitude,
            lng: item.longitude
        }))

        const lats = list.map(x => x.lat);
        const lngs = list.map(x => x.lng);

        const maxLat = Math.max(...lats);
        const minLat = Math.min(...lats);
        const maxLng = Math.max(...lngs);
        const minLng = Math.min(...lngs);

        console.log("maxLat", maxLat);
        console.log("minLat", minLat);
        console.log("maxLng", maxLng);
        console.log("minLng", minLng);

        const mappedList = list.map((item) => {
            const latNormal = (-100 * ((item.lat - maxLat) / (maxLat - minLat))) - 50;
            const lngNormal = (-100 * ((item.lng - maxLng) / (maxLng - minLng))) - 50;
            const latFinal = (latNormal);
            const lngFinal = (lngNormal);
            return `${latFinal} -50 ${lngFinal}`;
        });

        console.log(mappedList);

        const scene = document.getElementById("scene");
        for (let item of mappedList) {
            const box = document.createElement("a-box");
            box.setAttribute("position", item);
            box.setAttribute("rotation", "0 45 0");
            box.setAttribute("color", "red");
            scene.appendChild(box);
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
