import { IsNotEmpty,IsPositive ,IsOptional} from "class-validator";

export class QueryDto{
    @IsOptional()
    name?:string;
    @IsNotEmpty({message:'当前页不能为空'})
    @IsPositive({message:'当前页必须为正整数'})
    current:number=1;
    @IsNotEmpty({message:'每页数量不能为空'})
    @IsPositive({message:'每页数量必须为正整数'})
    size:number=10;
}