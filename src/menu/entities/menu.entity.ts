import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
enum MenuType {
    Primary = 1,
    Secondary = 2
}
@Entity({
    name: 'menus'
})
@Tree('closure-table')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: 'varchar',
        length: 50,
        comment: '权限标识'
    })
    code: string;
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,  // 确保这里设置为 true
        comment: '菜单名称'
    })
    name: string;
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,  // 确保这里设置为 true
        comment: '菜单组件'
    })
    component: string;
    @Column({
        type: 'varchar',
        nullable: true,  // 确保这里设置为 true
        comment: '菜单父级ID'
    })
    parentId: number | null;
    @Column({
        type: 'varchar',
        length: 50,
        comment: '菜单路径'
    })
    path: string;
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,  // 确保这里设置为 true
        comment: '菜单重定向'
    })
    redirect: string;
    @Column({
        type: 'int',
        comment: '菜单排序'
    })
    sort: number;
    @Column({
        type: 'enum',
        enum: MenuType,
        default: MenuType.Primary,
        comment: '菜单类型'
    })
    type: MenuType;
    @CreateDateColumn()
    createTime: Date;
    @UpdateDateColumn()
    updateTime: Date;
    @Column({
        type: 'varchar',
        length: 255,
        comment: '菜单备注'
    })
    remark: string;
    @TreeChildren({ cascade: ['remove'] })
    children: Menu[];
    @TreeParent({ onDelete: 'CASCADE' })
    parent: Menu;
    @Column({
        type: 'boolean',
        comment: '是否是外链'
    })
    isLink: boolean;
    @Column({
        type: 'json',
        comment: '菜单元信息'
    })
    meta: {
        cache: boolean;
        hidden: boolean;
        icon: string;
        isBreadcrumd?: boolean;
        linkTo?: string;
        title: string;
    }
}

