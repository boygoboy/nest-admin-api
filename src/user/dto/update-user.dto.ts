import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty} from "class-validator";

export class UpdateUserDto extends CreateUserDto {
    @IsNotEmpty({message:'用户id不能为空'})
    id: number;
}
