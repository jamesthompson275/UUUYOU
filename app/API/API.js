const _SERVER = "//greensland.space/"
window.API = {
    /**
    *	@return Promise<Object[]> Each Entry contains lat, lng, and label
    */
	GetMarkerLocations: (coords) => {
        const { lat, lng } = coords;
        return fetch(_SERVER  + "parkItemsi?lat=" + lat + "&lng=" + lng + "&threshold=" + threshold))
	    .then(response => response.json())
	    .then(response => response.map(x => ({
                 position: {
                     lat: x.lat,
                     lng: x.lng
                },
                label: "" + i
            });

        /*return Promise.resolve(new Array(Math.floor(Math.random() * 100)).fill(0).map((x, i) => ({
            position: {
                lat: lat - (Math.random() / 10),
                lng: lng + (Math.random() / 10)
            },
            label: "" + i
        })))*/
    }
};
