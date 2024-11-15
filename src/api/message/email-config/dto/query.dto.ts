import { IsNotEmpty, MaxLength, IsInt,Min,Max, IsString, IsBoolean, IsEmail } from "class-validator";
export class QueryDto {
    @IsNotEmpty({ message: 'smtp主机不能为空' })
    @MaxLength(20, { message: 'smtp主机长度不能超过20位' })
    @IsString({ message: 'smtp主机必须为字符串' })
    smtpHost:string;
    @IsNotEmpty({ message: 'smtp端口不能为空' })
    @IsInt({ message: 'smtp端口必须为整数' })
    @Min(1, { message: 'smtp端口最小值为1' })
    @Max(65535, { message: 'smtp端口最大值为65535' })
    smtpPort:number;
    @IsNotEmpty({ message: '启用ssl不能为空' })
    @IsBoolean({ message: '启用ssl必须为布尔值' })
    enableSsl:boolean;
    @IsNotEmpty({ message: '用户名不能为空' })
    @MaxLength(20, { message: '用户名长度不能超过20位' })
    @IsString({ message: '用户名必须为字符串' })
    userName:string;
    @IsNotEmpty({ message: '密码不能为空' })
    @MaxLength(20, { message: '密码长度不能超过20位' })
    @IsString({ message: '密码必须为字符串' })
    password:string;
    @IsNotEmpty({ message: '邮箱模板不能为空' })
    @MaxLength(255, { message: '邮箱模板长度不能超过255位' })
    @IsString({ message: '邮箱模板必须为字符串' })
    messageContent: string;
    @IsNotEmpty({ message: '邮箱不能为空' })
    @MaxLength(50, { message: '邮箱长度不能超过50位' })
    @IsEmail({}, { message: '邮箱格式不正确' })
    email:string;
}