export class PageResponseVo {
    id: number;
    username:string;
    nickName:string;
    accountStatus:boolean;
    roleIds?:number[];
    roles?:any[];
    password?:string;
    email:string;
    mobile:string;
    remark:string;
    createTime: Date;
    updateTime: Date;
}