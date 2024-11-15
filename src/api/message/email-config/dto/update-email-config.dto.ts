import { CreateEmailConfigDto } from './create-email-config.dto';
import { IsNotEmpty} from "class-validator";

export class UpdateEmailConfigDto extends CreateEmailConfigDto {
    @IsNotEmpty({message:'邮件配置id不能为空'})
    id: number;
}
