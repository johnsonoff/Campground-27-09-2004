mapboxgl.accessToken = map_access_token
const map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v12', 
  center: camps.geometry.coordinates, 
  zoom: 13
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(camps.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${camps.title}</h3><p>${camps.location}</p>`
            )
    )
    .addTo(map)