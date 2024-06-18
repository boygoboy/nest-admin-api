
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty} from "class-validator";
export class UpdateRoleDto extends CreateRoleDto {
    @IsNotEmpty({message:'角色id不能为空'})
    id: number;
}
