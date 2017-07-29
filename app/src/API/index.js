/**
*	@return Promise<Object[]> Each Entry contains lat, lng, and label
*/
const GetMarkerLocations = (lat, lng) => {
	return fetch(SERVER + "/markers", {
		method: "POST",
		body: {
			lat, lng
		}
	})
}

module.exports = {
	GetMarkerLocations
}