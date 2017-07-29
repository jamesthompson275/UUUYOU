const start = async () => {
    let list;

    try {
        const data = await fetch("http://greensland.space/parkItems?lat=-27.38142559&lng=153.040722");
        const json = await data.json();
        list = json.slice(0, 100).map((item) => ({
            lat: item.latitude,
            lng: item.longitude
        }))

    } catch (err) {
        console.log(err);
    }

    const sortedLat = list.sort((a, b) => {
        return a.lat - b.lat
    });

    const sortedLng = list.sort((a, b) => {
        return a.lng - b.lng
    });

    const normalList = sortedLat.map((item) => {
        return {
            lat: (((item.lat - sortedLat[0].lat) / (sortedLat[sortedLat.length - 1].lat - sortedLat[0].lat)) - 0.5) * 10,
            lng: (((item.lng - sortedLng[0].lng) / (sortedLat[sortedLng.length - 1].lng - sortedLng[0].lng)) - 0.5) * 10
        };
    })

    const mappedList = normalList.map((item) => (
        `${item.lat} 0 ${item.lng}`
    ));

    const scene = document.getElementById("scene");
    for (let item of mappedList) {
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
