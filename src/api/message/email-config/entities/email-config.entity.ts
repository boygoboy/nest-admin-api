import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity({
    name: 'emailconfig'
})
export class EmailConfig {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: 'varchar',
        comment: '邮箱配置标题',
        length: 20,
    })
    emailTitle: string;
    @Column({
        type: 'varchar',
        comment: '邮箱名称',
        length: 50,
    })
    emailName:string;
    @Column({
        type: 'varchar',
        comment: 'smtp主机',
        length: 50,
    })
    smtpHost:string;
    @Column({
        type: 'int',
        comment: 'smtp端口',
    })
    smtpPort:number;
    @Column({
        type: 'varchar',
        comment: '启用ssl',
        length: 20,
    })
    enableSsl:boolean;
    @Column({
        type: 'varchar',
        comment: '用户名',
        length: 20,
    })
    userName:string;
    @Column({
        type: 'varchar',
        comment: '密码',
        length: 20,
    })
    password:string;
    @Column({
        type: 'varchar',
        comment: '邮箱模板',
        length: 255,
        nullable: true
    })
    messageContent: string;
}
