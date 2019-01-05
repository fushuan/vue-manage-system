
import request from '../../../utils/request'
const prefix = "/spider/collection/rule/"

export function getCollectionRules(data) {
    return request({
        url: prefix + "getCollectionRules",
        method: 'POST',
        data
    })
}



export function addCollectionRule(data) {
    return request({
        url: prefix + "addCollectionRule",
        method: 'POST',
        data
    })
}


export function removeCollectionRule(data) {
    return request({
        url: prefix + "removeCollectionRule/" + data,
        method: 'POST'
    })
}

