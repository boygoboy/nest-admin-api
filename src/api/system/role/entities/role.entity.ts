import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';
@Entity({
    name: 'roles'
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: 'varchar',
        comment: '角色编码',
        length: 20,
    })
    roleCode: string;
    @Column({
        type: 'varchar',
        comment: '角色名称',
        length: 20,
    })
    roleName: string;
    @Column({
        type: 'boolean',
        comment: '角色状态',
        default: false
    })
    status: boolean;
    @Column({
        type: 'varchar',
        comment: '备注',
        length: 255,
        nullable: true
    })
    remark: string;
    @CreateDateColumn()
    createTime: Date;
    @UpdateDateColumn()
    updateTime: Date;
    @ManyToMany(() => Menu)
    @JoinTable({
        name: 'role_menu',
    })
    menus: Menu[];
}
