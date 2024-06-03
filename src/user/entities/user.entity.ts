import {CreateDateColumn,UpdateDateColumn,Column,PrimaryGeneratedColumn,Entity, ManyToMany,JoinTable} from 'typeorm'
import {Role} from '@/role/entities/role.entity'
@Entity({
    name:'users'
})
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({
        comment:'用户名',
        length: 20,
        unique:true
    })
    username: string;
    @Column({
        comment:'昵称',
        length: 20,
    })
    nickName:string; 
    @Column({
        default:false,
        comment:'账好状态'
    })
    accountStatus: boolean;
    @Column({
        comment:'密码',
        select:false,
        length: 20
    })
    password: string;
    @Column({
        comment:'邮箱',
        length: 20,
        unique:true
    })
    email:string;
    @Column({
        comment:'手机号',
        length: 20,
        unique:true
    })
    mobile:string;
    @Column({
        comment:'备注',
        length: 255
    })
    remark: string;
    @CreateDateColumn()
    createTime: Date;
    @UpdateDateColumn()
    updateTime: Date;
    @Column({
        comment:'角色id',
        type:'simple-array'
    })
    roleIds: number[];
    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_roles'
    })
    roles:Role[];
}
