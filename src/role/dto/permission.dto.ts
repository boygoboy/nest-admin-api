import { ArrayNotEmpty} from "class-validator";

export class PermissionDto{
    @ArrayNotEmpty({message:'权限id不能为空'})
    permissionIds:number[];
}