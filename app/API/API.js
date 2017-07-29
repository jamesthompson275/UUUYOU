window.API = {
    /**
    *	@return Promise<Object[]> Each Entry contains lat, lng, and label
    */
	GetMarkerLocations: (lat, lng) => {
        return fetch(SERVER + "/markers", {
            method: "POST",
            body: {
                lat, lng
            }
        })
    }
};
