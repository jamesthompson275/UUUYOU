window.API = {
    /**
    *	@return Promise<Object[]> Each Entry contains lat, lng, and label
    */
	GetMarkerLocations: (coords) => {
        const { lat, lng } = coords;
        /*return fetch(SERVER + "/markers", {
            method: "POST",
            body: {
                lat, lng
            }
        })*/
        return Promise.resolve(new Array(Math.floor(Math.random() * 100)).fill(0).map((x, i) => ({
            position: {
                lat: lat - (Math.random() / 10),
                lng: lng + (Math.random() / 10)
            },
            label: "" + i
        })))
    }
};
