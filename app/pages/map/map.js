const GoogleMap = window.GoogleMap;
const NewMap = GoogleMap.NewMap;

const mapPage = () => {
    const mapContainer = document.getElementById("mapContainer");
    const width = mapContainer.getBoundingClientRect().width;
    const height = mapContainer.getBoundingClientRect().height;
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
    });
    setTimeout(function() {
        GoogleMap.AddMarkers();        
    }, 250);
    
}

function Show_VR(itemID) {
    document.getElementById("snack").style.display = "none";
    
    const vr = document.getElementById("vr");
    vr.style.display = "block";
    vr.src = "../vr/index.html?park=" + itemID;
    vr.addEventListener("load", function() {
        vr.contentWindow.document.addEventListener("keyup", function(e) {
            if (e.keyCode == 27) {
                document.getElementById("snack").style.display = "block";
                document.getElementById("vr").style.display = "none";
            }
        });
    });
    
}

const init = () => {
    setTimeout(function() {
        mapPage();
    }, 1000);
    
    let currentMessage = undefined;
    let timeout = 2500;
    const n = function() {
        const openSnackbar = document.getElementById("snack");
        if (openSnackbar.style.display == "none") {
            return setTimeout(n, timeout);
        } else if (currentMessage === undefined) {
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
        
        
        const snackbar = new window.snackbar(document.getElementById("snack"), "bottom-center", "Are you interested in " + currentMessage.original.type, 
        2000,
        () => {
            GoogleMap.GoTo(currentMessage.marker);
            fetch(`//greensland.space/api/randomItemToReview?id='${currentMessage.original.ItemID}'&positive=1`);

            currentMessage = "";
            timeout = 10000;
            setTimeout(n, timeout);
        }, () => {
            fetch(`//greensland.space/api/randomItemToReview?id='${currentMessage.original.ItemID}'&positive=0`);
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
