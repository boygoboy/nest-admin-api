import { IsNotEmpty,MaxLength,IsPositive, IsString,IsEnum,IsBoolean ,IsOptional} from "class-validator";
enum MenuType {
    Primary = 1,
    PrimaryStr='1',
    Secondary = 2,
    SecondaryStr='2'
}

export class CreateMenuDto {
    @IsString({message:'父级ID必须为字符串'})
    parentId: string;
    @IsNotEmpty({message:'菜单名称不能为空'})
    @MaxLength(50,{message:'菜单名称长度不能超过50位'})
    @IsString({message:'菜单名称必须为字符串'})
    name:string;
    @IsNotEmpty({message:'权限标识不能为空'})
    @MaxLength(50,{message:'权限标识长度不能超过50位'})
    @IsString({message:'权限标识必须为字符串'})
    @IsOptional()
    code:string;
    @IsNotEmpty({message:'组件名称不能为空'})
    @MaxLength(50,{message:'组件名称长度不能超过50位'})
    @IsString({message:'组件名称必须为字符串'})
    @IsOptional()
    component:string;
    @IsNotEmpty({message:'路径不能为空'})
    @MaxLength(50,{message:'路径长度不能超过50位'})
    @IsString({message:'路径必须为字符串'})
    path:string;
    @MaxLength(50,{message:'重定向长度不能超过50位'})
    @IsString({message:'重定向必须为字符串'})
    redirect:string;
    @IsNotEmpty({message:'菜单类型不能为空'})
    @IsEnum(MenuType,{message:'菜单类型必须为Primary或Secondary'})
    type:MenuType;
    @IsNotEmpty({message:'排序不能为空'})
    @IsPositive({message:'排序必须为正整数'})
    sort:number;
    @IsString({message:'备注必须为字符串'})
    @MaxLength(255,{message:'备注长度不能超过255位'})
    remark:string;
    @IsBoolean({message:'是否是外链必须为布尔值'})
    isLink:boolean;
    @IsNotEmpty()
    meta:{
        cache: boolean;
        hidden: boolean;
        icon: string;
        isBreadcrumd?: boolean;
        linkTo?: string;
        title: string;
    };
}
