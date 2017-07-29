const GoogleMap = window.GoogleMap;
const NewMap = GoogleMap.NewMap;

const mapPage = () => {
    console.log("a");
    const mapContainer = document.getElementById("mapContainer");
	NewMap(mapContainer, {
		width: 600,
		height: 600,
		options: {
			zoom: 10,
			center: {
				lat: -27.4697707,
				lng: 153.0251235
			}
        }
	})
}

const init = () => {
    setTimeout(function() {
        mapPage();
    }, 1000);
};

(function () {
    if (document.readyState != "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})()
