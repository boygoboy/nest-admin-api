import * as crypto from 'crypto';
import {  HttpStatus } from '@nestjs/common';
import {IResponseData,IResponsePagerData,HasParentId} from '@/utils/types';
export function md5(str:string) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

export function formatResponsePagerData<T>(data:IResponsePagerData):IResponseData<T>{
    return {
        total:data.meta.totalItems,
        records:data.items
    }
}



export function filterParentandChildren<T extends HasParentId>(data:T[]) {
    let parents = data.filter((p:T) => p.parentId === null)
    let children = data.filter((c:T) => c.parentId !== null)
    handleChildren(parents, children)
    return parents
}

function handleChildren<T extends HasParentId>(parents:T[], children:T[]) {
    parents.map(p => {
        children.map((c,i) => {
            if (p.id === c.parentId) {
                let _children=JSON.parse(JSON.stringify(children))
                _children.splice(i,1)
                handleChildren([c],_children)
                if (p.children) {
                    p.children.push(c)
                } else {
                    p.children = [c]
                }
            }
        })
    })
}