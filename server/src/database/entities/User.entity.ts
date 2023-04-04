import { Entity, Column, PrimaryGeneratedColumn,JoinColumn, OneToOne , ManyToMany, JoinTable, OneToMany} from 'typeorm';
import { Profile } from './Profile.entity';
import { Role } from './Role.entity';
import { Product } from './Product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  code!:string;
  @Column({default:false})
  activation!:boolean;
  
  @Column({default:false})
  codeSent!:boolean
@OneToOne(()=>Profile)
@JoinColumn()
 profile!:Profile;

 // Define the many-to-many relationship with the roles table
 @ManyToMany(() => Role, role => role.users)
 @JoinTable()
 roles!: Role[];
 @OneToMany(()=>Product, product=>product.users)
 products!:Product[]
}