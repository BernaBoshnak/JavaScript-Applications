import * as api from './api.js';

const host = 'http://localhost:3030';
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getAllListings() {
    return await api.get(host + '/data/cars?sortBy=_createdOn%20desc');
}

export async function getListingById(id) {
    return await api.get(host + '/data/cars/' + id);
}

export async function createCarListing(car) {
    return await api.post(host + '/data/cars', car);
}

export async function deleteCar(id) {
    return await api.del(host + '/data/cars/' + id);
}
