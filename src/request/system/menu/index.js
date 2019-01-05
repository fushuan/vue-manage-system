// import request from '/utils/request'

import request from '../../../utils/request'
const prefix = "/system/menu/"

export function getMenuTree() {
    return request({
        url: prefix + "menuTree",
        method: 'POST'
    })
}

export function addMenu(data) {
    return request({
        url: prefix + "addMenu",
        method: 'POST',
        data
    })
}

export function editMenu(data) {
    return request({
        url: prefix + "editMenu",
        method: 'POST',
        data
    })
}

export function removeMenu(data) {
    return request({
        url: prefix + "removeMenu/" + data,
        method: 'POST'
    })
}

