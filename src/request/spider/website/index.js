// import request from '/utils/request'

import request from '../../../utils/request'
const prefix_website = "/spider/website/"

export function getWebsiteTree(data) {
    return request({
        url: prefix_website + "getWebsiteTree",
        method: 'POST',
        data
    })
}

export function getWebsite(data) {
    return request({
        url: prefix_website + "getWebsite",
        method: 'POST',
        data
    })
}



export function addWebsite(data) {
    return request({
        url: prefix_website + "addWebsite",
        method: 'POST',
        data
    })
}

export function editWebsite(data) {
    return request({
        url: prefix_website + "editWebsite",
        method: 'POST',
        data
    })
}
export function removeWebsite(data) {
    return request({
        url: prefix_website + "removeWebsite/" + data,
        method: 'POST'
    })
}

