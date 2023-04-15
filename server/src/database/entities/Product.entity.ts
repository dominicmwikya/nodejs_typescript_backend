import {Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User.entity';
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
    @ManyToOne (()=>User, user=>user.products)
    users!:User
}