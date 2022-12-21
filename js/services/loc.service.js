import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    getPlace,
    addLocation,
    deletePlace,
    getPlaces,
    deletePlace,
}

const CLICKS_DB = 'mapClicksDB'

// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
// ]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function addLocation(locName, mapsMouseEvent) {
    console.log(mapsMouseEvent.latLng.toJSON())
    return storageService.post(CLICKS_DB, {
        name: locName,
        lat: mapsMouseEvent.latLng.toJSON().lat,
        lng: mapsMouseEvent.latLng.toJSON().lng,
        createdAt: new Date().getTime(),
    })
}

function getPlaces() {
    return storageService.query(CLICKS_DB)
}

function getPlace(id) {
    return storageService.get(CLICKS_DB, id)
}

function deletePlace(id) {
    return storageService.remove(CLICKS_DB, id)
}
