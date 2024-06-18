import { IsNotEmpty,MaxLength} from "class-validator";

export class PasswordDto{
    @IsNotEmpty({message:'用户id不能为空'})
    userId:number
    @IsNotEmpty({message:'密码不能为空'})
    @MaxLength(50,{message:'密码长度不能超过50位'})
    newPassword:string;
    @IsNotEmpty({message:'确认密码不能为空'})
    @MaxLength(50,{message:'确认密码长度不能超过50位'})
    repPassword:string;
}