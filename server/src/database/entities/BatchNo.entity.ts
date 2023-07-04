import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class BatchNumbers{
    @PrimaryGeneratedColumn()
    id!:number;
}