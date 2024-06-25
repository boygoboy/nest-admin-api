
import { IsNotEmpty, MaxLength, IsString, IsBoolean, IsOptional, ArrayNotEmpty, IsEmail, IsMobilePhone } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @IsString({ message: '用户名必须是字符串' })
    @MaxLength(20, { message: '用户名最大长度为20' })
    username: string;
    @IsNotEmpty({ message: '昵称不能为空' })
    @IsString({ message: '昵称必须是字符串' })
    @MaxLength(20, { message: '昵称最大长度为20' })
    nickName: string;
    @IsNotEmpty({ message: '账号状态不能为空' })
    @IsBoolean({ message: '账号状态必须是布尔值' })
    accountStatus: boolean = false;
    @IsOptional()
    @MaxLength(50, { message: '密码最大长度为50' })
    password?: string;
    @IsNotEmpty({ message: '邮箱不能为空' })
    @MaxLength(50, { message: '邮箱最大长度为50' })
    @IsEmail()
    email: string;
    @IsNotEmpty({ message: '手机号不能为空' })
    @MaxLength(20, { message: '手机号最大长度为20' })
    @IsMobilePhone()
    mobile: string;
    @IsOptional()
    @MaxLength(255, { message: '备注最大长度为255' })
    remark?: string;
    @ArrayNotEmpty()
    roleIds: number[];
}
