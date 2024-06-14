import { IsNotEmpty} from "class-validator";
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends CreateMenuDto {
    @IsNotEmpty({message:'菜单ID不能为空'})
    id: number;
}
