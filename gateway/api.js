const axios = require("axios");
const config = require("../config.json");

class BaseApiGateway {
    constructor(token) {
        this._token = token;
    }

    async get(url, queryParams) {
        return this.request('GET', this._buildUrl(url, queryParams))
    }

    async request(method, url, body = {}) {
        return axios.request({
            method,
            url,
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${this._token}`
            }
        })
    }

    _buildUrl(url, queryParams) {
        return `${config.discordApiUrl}${url}${this._buildQueryParams(queryParams)}`
    }

    _buildQueryParams(queryParams) {
        return queryParams && Object.keys(queryParams).length
            ? '?' + Object.keys(queryParams).map(key => encodeURI(`${key}=${queryParams[key]}`)).join('&')
            : "";
    }
}
module.exports = BaseApiGateway;
