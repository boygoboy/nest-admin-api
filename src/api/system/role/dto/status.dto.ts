import { IsNotEmpty, IsBoolean } from "class-validator";

export class StatusDto {
    @IsNotEmpty({ message: '角色id不能为空' })
    id: number
    @IsNotEmpty({ message: '状态不能为空' })
    @IsBoolean({ message: '状态必须是布尔值' })
    status: boolean;
}