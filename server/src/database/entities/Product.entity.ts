import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
     id!:number;
    @Column()
     item_name!:string;
    @Column()
     item_category!:string;
    @Column()
     min_qty!:number;
    @Column()
     qty!:number;
    @Column({default:"admin"})
     user!:string


}