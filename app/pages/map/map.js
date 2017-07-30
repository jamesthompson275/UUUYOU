const GoogleMap = window.GoogleMap;
const NewMap = GoogleMap.NewMap;

const mapPage = () => {
    const mapContainer = document.getElementById("mapContainer");
    const width = mapContainer.getBoundingClientRect().width;
    const height = mapContainer.getBoundingClientRect().height;
    console.log(width);
	NewMap(document.getElementById("map"), {
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
    
    let currentMessage = undefined;
    let timeout = 2500;
    const n = function() {
        if (currentMessage === undefined) {
            currentMessage =  GoogleMap.GetRandom();
            if (currentMessage === undefined) {
                setTimeout(n, timeout);
                return;
            }
        } else if (currentMessage != "") {
            setTimeout(n, timeout);
            return;
        } else {
            currentMessage =  GoogleMap.GetRandom();
        }
        
        
        const openSnackbar = document.getElementById("snack");
        const snackbar = new window.snackbar(document.getElementById("snack"), "bottom-center", "Are you interested in " + currentMessage.original.type, 
        2000,
        () => {
            GoogleMap.GoTo(currentMessage.marker);
            currentMessage = "";
            timeout = 10000;
            setTimeout(n, timeout);
        }, () => {
            console.log("no");
            currentMessage = "";
            timeout = 50;
            setTimeout(n, timeout);
        });
        
        snackbar.show();
        
    }
    setTimeout(n, timeout);
};

(function () {
    if (document.readyState != "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})()
