import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilsService } from './services/utils.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGo = onGo
window.onDelete = onDelete
window.onSearch = utilsService.debounce(onSearch, 1000)
window.onCopy = onCopy

function onInit() {
    const params = getQueryParams()
    console.log(params.lat)

    mapService
        .initMap(+params.lat, +params.lng)
        .then(() => {
            getQueryParams()
            renderPlaces()
            mapService.getMap().addListener('click', onAddLocation)
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({
        lat: 32.0749831,
        lng: 34.9120554,
    })
}

function onGetLocs() {
    locService.getLocs().then(locs => {
        console.log('Locations:', locs)
        document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
    })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            // document.querySelector(
            //     '.user-pos'
            // ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    console.log(lat, lng)
    // console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onGo(id) {
    locService.getPlace(id).then(place => mapService.panTo(place.lat, place.lng))
}

function onDelete(id) {
    locService.deletePlace(id).then(renderPlaces)
}

function onCopy(id) {
    locService.getPlace(id).then(place => {
        navigator.clipboard.writeText(
            `https://foresen.github.io/travel-tip-starter/?lat=${place.lat}&lng=${place.lng}`
        )
        mapService.panTo(place.lat, place.lng)
    })
}

function renderPlaces() {
    locService.getPlaces().then(places => {
        const strHTML = places.map(
            place => `<article class="loc-item">
        <div class="loc-info">
            <h3 class="loc-title">Location: ${place.name}</h3>
            <p><h5>Location LatLng:</h5> ${place.lat.toFixed(3)} , ${place.lng.toFixed(3)}</p>
        </div>
        <div class="loc-time">
            <p>Created At: ${new Date(place.createdAt).toDateString()}</p>
        </div>
        <div class="loc-btns">
            <button onclick="onDelete('${
                place.id
            }')" title="Delete" class="btn-delete"><i class="fa-regular fa-trash-can"></i></button>
            <button onclick="onGo('${
                place.id
            }')" title="Go" class="btn-go"><i class="fa-solid fa-location-arrow"></i></button>
            <button onclick="onCopy('${
                place.id
            }')" title="Copy Link" class="btn-link"><i class="fa-solid fa-link"></i></button>
        </div>
    </article>`
        )
        document.querySelector('.locations-list').innerHTML = strHTML.join('')
    })
}

function onSearch(searchKey) {
    mapService.getLatLng(searchKey).then(latLng => mapService.panTo(latLng.lat, latLng.lng))
}

function onAddLocation(mapsMouseEvent) {
    console.log('mapsMouseEvent:', mapsMouseEvent)
    openModal()
        .then(locName => {
            console.log(locName)
            closeModal()
            return locService.addLocation(locName, mapsMouseEvent)
        })
        .then(renderPlaces)
}

function getQueryParams() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
    return params
}

function openModal() {
    document.querySelector('.modal-wrapper').classList.add('open')
    return new Promise((resolve, reject) => {
        document.querySelector('.modal-btn').addEventListener('click', () => {
            resolve(document.querySelector('#locName').value)
        })
    })
}

function closeModal() {
    document.querySelector('.modal-wrapper').classList.remove('open')
}
