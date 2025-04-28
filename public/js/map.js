

maplibregl.accessToken = mapToken; 
  const map = new maplibregl.Map({
           container:'map',
           style:
           'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
           center:listing.geometry.coordinates,
           zoom: 8
});
  
if (Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2) {
  if (typeof listing.geometry.coordinates[0] === 'number' && typeof listing.geometry.coordinates[1] === 'number') {
    // Create a marker at the coordinates
    const marker = new maplibregl.Marker({ color: "red" })
      .setLngLat(listing.geometry.coordinates)  // Set the marker's position using the correct coordinates format
      .setPopup(new maplibregl.Popup({ offset: 25 })  // Use maplibregl.Popup, not maptilersdk.Popup
        .setHTML(`<h6>${listing.title}</h6><p>Exact Location will be provided after booking!</p>`))  // Set the popup content
      .addTo(map);  // Add the marker to the map
  } else {
    console.error('Coordinates should be numbers:', listing.geometry.coordinates);
  }
} else {
  console.error('Invalid coordinates format:', listing.geometry.coordinates);
}
