const GoogleMap = window.GoogleMap;
const NewMap = GoogleMap.NewMap;

const mapPage = () => {
    const mapContainer = document.getElementById("mapContainer");
    const width = mapContainer.getBoundingClientRect().width;
    const height = mapContainer.getBoundingClientRect().height;
    console.log(width);
	NewMap(mapContainer, {
		width: width,
		height: height,
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
