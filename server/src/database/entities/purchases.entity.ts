import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Supplier } from './Supplier.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';
@Entity()
export class Purchases{
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Product, product => product.purchases, {onDelete:'CASCADE'})
    @JoinColumn()
    product!: Product;
  
    @ManyToOne(() => Supplier, supplier => supplier.purchases)
    supplier!: Supplier;
   

    @ManyToOne(() => User, user => user.purchases)
    user!: User;
  
    @Column({ type: 'int' })
    quantity!: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;
    @Column()
     total!:number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}