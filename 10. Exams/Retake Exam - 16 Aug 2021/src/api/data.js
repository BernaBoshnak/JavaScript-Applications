import * as api from './api.js';

const host = 'http://localhost:3030';
api.setting.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getAllGames() {
    return await api.get(host + '/data/games?sortBy=_createdOn%20desc');
}

export async function getGameById(id) {
    return await api.get(host + '/data/games/' + id);
}

export async function createGame(game) {
    return await api.post(host + '/data/games', game);
}

export async function updateGame(id, game) {
    return await api.put(host + '/data/games' + id, game);
}

export async function deleteGame(id) {
    return await api.get(host + '/data/games/' + id);
}
