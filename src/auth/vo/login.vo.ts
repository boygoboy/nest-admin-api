interface User{
    id: number;
    username: string;
    nickName: string,
    accountStatus: boolean,
    email: string,
    mobile: string,
    remark: string,
    createTime: Date,
    updateTime: Date,
    roleIds: Array<number>,
    roles: Array<number>
}

export class LoginVo {
    access_token:string;
    refresh_token:string;
    user:User
}