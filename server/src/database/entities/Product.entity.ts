import {Entity, Column, PrimaryGeneratedColumn,OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { Supplier } from './Supplier.entity';
import { Purchases } from './purchases.entity';
import { Sale } from './sales.entity';
@Entity()
export class Product{
    @PrimaryGeneratedColumn()
     id!:number;
     
    @Column()
     name!:string;

    @Column()
     category!:string;

    @Column()
     min_qty!:number;
     
    @Column({default:0})
     qty!:number;

    @OneToMany(() => Purchases, purchase => purchase.product, {onDelete:'CASCADE'})
    @JoinColumn()
    purchases!: Purchases[];

    @ManyToOne (()=>User, user=>user.products)
    users!:User

    @Column({default:0})
     flag!:number;

    @OneToMany(() => Sale, sale => sale.products,  {onDelete:'CASCADE'})
    @JoinColumn()
    sales!: Sale[];

    @ManyToOne(() => Supplier, (supplier) => supplier.products, { onDelete: 'CASCADE' })
    @JoinColumn()
      supplier!: Supplier;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}