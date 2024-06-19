
import {
    IPaginationMeta,
    IPaginationLinks
  } from 'nestjs-typeorm-paginate';
export interface IResponseData<T=any> {
    total:number;
    records:Array<T>;
}

export interface IResponsePagerData<T=any> {
    items:Array<T>;
    meta:IPaginationMeta;
    links?:IPaginationLinks;
}

export  interface HasParentId {
    parentId: number | null;
    id:number;
    children?:any[]
  }