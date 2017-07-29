let _Map = null;


function initMap() {
    
}

window.GoogleMap = {
    /**
        Makes a new map instance on the given target
        @param target HTMLElement The HTML element to mount the map onto
        @param config Object
        @param config.width the width of the target
        @param config.height the height of the target
        @param config.options The google map options
    */
	NewMap: (target, config) => {
        const { width, height, options } = config;
        target.style.width = width + "px";
        target.style.height = height + "px";
        
        _Map = new google.maps.Map(target, options);
        console.log(_Map);
    },
	AddMarkers: () => {
        // Ping API endpoint
        const {latitude, longitude } = _Map.getCameraPosition().target;
        window.API.GetMarkerLocations({
            lat: latitude,
            lng: longitude
        })
        .then(newMarkers => {
            const newMapMarkers = newMarkers.map(new google.maps.Marker);
            const markerCluster = new MarkerClusterer(_Map,
                newMapMarkers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
            );
        })
        .catch(err => {
            throw new Error(err)
        });
    }
}