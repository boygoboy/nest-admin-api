import { IsNotEmpty, MaxLength, IsPositive, IsString, IsEnum, IsBoolean, IsOptional } from "class-validator";
export class CreateRoleDto {
    @IsNotEmpty({ message: '角色编码不能为空' })
    @MaxLength(20, { message: '角色编码长度不能超过20位' })
    @IsString({ message: '角色编码必须为字符串' })
    roleCode: string;
    @IsNotEmpty({ message: '角色名称不能为空' })
    @MaxLength(20, { message: '角色名称长度不能超过20位' })
    @IsString({ message: '角色名称必须为字符串' })
    roleName: string;
    @IsBoolean({ message: '角色状态必须为布尔值' })
    @IsNotEmpty({ message: '角色状态不能为空' })
    status: boolean = false;
    @IsOptional()
    @MaxLength(255, { message: '备注长度不能超过255位' })
    @IsString({ message: '备注必须为字符串' })
    remark: string;
}
