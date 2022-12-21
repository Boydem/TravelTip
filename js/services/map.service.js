import { utilsService } from './utils.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    panToMyPlace,
    getMap,
    getLatLng,
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi().then(() => {
        gMap = new google.maps.Map(document.querySelector('#map'), {
            center: {
                lat,
                lng,
            },
            zoom: 15,
        })
    })
}

function getMap() {
    return gMap
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB5mXoA76shI6CK3DmGjZi3M4PMn7YX4WA'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function panToMyPlace() {
    navigator.geolocation.getCurrentPosition(position => {
        gMap.panTo(lat, lng)
    }, handleLocationError)
}

function getLatLng(geoSearchKey) {
    const GEOLOC_API_KEY = 'AIzaSyAGOha26uaC3QPurMNL2eP6Pb870wV9R_0'
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${geoSearchKey}&key=${GEOLOC_API_KEY}`
    return fetch(url)
        .then(res => res.json())
        .then(geoCodeObj => {
            return geoCodeObj.results[0].geometry.location
        })
}

// function handleLocationError(error) {
//     var locationError = document.getElementById('locationError')

//     switch (error.code) {
//         case 0:
//             locationError.innerHTML =
//                 'There was an error while retrieving your location: ' + error.message
//             break
//         case 1:
//             locationError.innerHTML = "The user didn't allow this page to retrieve a location."
//             break
//         case 2:
//             locationError.innerHTML =
//                 'The browser was unable to determine your location: ' + error.message
//             break
//         case 3:
//             locationError.innerHTML = 'The browser timed out before retrieving the location.'
//             break
//     }
// }
