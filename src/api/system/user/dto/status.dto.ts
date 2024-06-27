import { IsNotEmpty,IsBoolean} from "class-validator";

export class StatusDto{
    @IsNotEmpty({message:'用户id不能为空'})
    userId:number
    @IsNotEmpty({message:'状态不能为空'})
    @IsBoolean({message:'状态必须是布尔值'})
    accountStatus:boolean;
}