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
    
    let currentMessage = null;
    setInterval(function() {
        if (currentMessage) {
            return;
        }
        
        currentMessage = "Are you interested in x";
        const openSnackbar = document.getElementById("openSnackbar");
        const snackbar = new window.snackbar("bottom-right", currentMessage, 
        2000,
        () => {
            console.log("yes");
            currentMessage = "";
        }, () => {
            console.log("no");
            currentMessage = "";
        });
        
        snackbar.show();
    }, 2500);
};

(function () {
    if (document.readyState != "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})()
