import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from 'typeorm';
@Entity({
    name:'roles'
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        comment: '角色编码',
        length: 20,
        unique: true
    })
    roleCode: string;
    @Column({
        comment: '角色名称',
        length: 20,
        unique: true
    })
    roleName: string;
    @Column({
        comment: '角色状态',
        default: false
    })
    status:boolean;
    @Column({
        comment: '备注',
        length: 255
    })
    remark: string;
    @CreateDateColumn()
    createTime: Date;
    @UpdateDateColumn()
    updateTime: Date;
}
