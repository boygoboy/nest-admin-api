import { IsNotEmpty ,IsOptional} from "class-validator";
import {IsNumericString} from '@/utils/custom-validator'

export class QueryDto{
    @IsOptional()
    keyword?:string;
    @IsNotEmpty({message:'当前页不能为空'})
    @IsNumericString({message:'当前页必须为正整数'})
    current:number=1;
    @IsNotEmpty({message:'每页数量不能为空'})
    @IsNumericString({message:'每页数量必须为正整数'})
    size:number=10;
}