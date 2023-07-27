import { User } from '../entities/User.entity';
import { databaseConfig } from '../dbconfig';
import bcrypt from 'bcrypt';
import userData from '../../interfaces/user';
import Jwt from 'jsonwebtoken';
import { Mailservice } from '../../helpers/mail.service';
import { Role } from '../entities/Role.entity';
import { Pagination } from '../../helpers/pagination'
import PaginationOptions from '../../interfaces/paginationOptions'
import PaginationData from '../../interfaces/PaginationData';
export default class UserRepository {
  private static readonly UserRepo = databaseConfig.getRepository(User);
  private static readonly RoleRepo = databaseConfig.getRepository(Role);

  private static readonly saltRounds = 10;
  private static readonly tokenExpirationTimeInSeconds = 60 * 60; // 1 hour

  private static passwordEncrypt(password: string): string {
    
    const salt = bcrypt.genSaltSync(this.saltRounds);
    return bcrypt.hashSync(password, salt);

  }

  private static passwordDecrypt(password: string, user: User): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  static Paginate = async (options: PaginationOptions): Promise<PaginationData<User>> => {
    const result = await Pagination(this.UserRepo, options);
    return result;
  }
  private static generateUserToken(user: User): any {
    const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const expiryTimeInSeconds = currentTime + this.tokenExpirationTimeInSeconds;
    const my_secret_key: any = process.env.SECRET_KEY_API_KEY;

    const payload: object = {
      id: user.id,
      email: user.email,
      role:user.role,
      name: user.firstName + ' ' + user.lastName,
    };
    const token: string = Jwt.sign({ payload, exp: expiryTimeInSeconds }, my_secret_key);

    return { accessToken: token, expirytime: expiryTimeInSeconds, user: payload };
  }

  private static generateRandomString(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  static async registerUser(user: User, roleId: any): Promise<User> {
    const existingUser  = await this.UserRepo.findOneBy({ email: user.email });

    if (existingUser ) {
      throw new Error(`User with ${user.email} already exists! Choose new email`);
    }

    const role = await this.RoleRepo.findOneBy({ id: roleId });

    if (!role) {
      throw new Error(`Role with id ${roleId} not found`);
    }

    const uniquestring = this.generateRandomString();

    user.password = this.passwordEncrypt(user.password);
    user.roles = [role];
    user.code = uniquestring;

    const mailService = new Mailservice();

    try {
      const createdUser = await this.UserRepo.save(user);

      await mailService.sendEmail(
        user.email,
        'Email Confirmation',
        `<a href='http://localhost:8000/users/verify/${uniquestring}'>Click here to verify your email.</a>`
      );

      return createdUser;
    } catch (error) {
      console.error(`Failed to create user or send email to ${user.email}: ${error}`);
      throw new Error('Error creating the user or sending confirmation email.');
    }
  }
  

  static async verifyCode<User>(code: string): Promise<User|any> {
    const userResult = await this.UserRepo.find({ where: { code: code } });

    if (!userResult.length) {
      throw new Error(`Invalid activation code: ${code}.`);
    }

    const user = userResult[0];

    user.activation = true;
    user.code = '';

    try {
      await this.UserRepo.save(user);

      const mailService = new Mailservice();

      await mailService.sendEmail(
        user.email,
        'Account activated successfully!',
        `<a href='http://localhost:3000/login'>Click here to login.</a>`
      );

      return {
        message:"User Account activated!."
      };
    } catch (error) {
      throw new Error("Error verifying the user or sending email");
    }
  }
  
  static async loginUser(userdetails: userData): Promise<any | null> {
    const userExists = await this.UserRepo.find({ where: { email: userdetails.email } });
  
    if (!userExists[0]) {
      throw new Error(`user with email ${userdetails.email} doesnt exist`)
    }
  
    const confirmpassword: boolean = this.passwordDecrypt(userdetails.password, userExists[0]);
  
    if (!confirmpassword) {
      throw new Error("Invalid login details! Try again");
    }
  
    const checkActiveStatus = await this.UserRepo.findOne({
      where: {
        email: userExists[0].email,
        activation: !!1, // cast 1 to boolean
      }
    });
  
    if (!checkActiveStatus) {
      throw new Error('Your account is inactive! Please activate your account.')
    } else {
      const generatedAccessToken = this.generateUserToken(userExists[0]);

      return {
        token: generatedAccessToken,
        role:userExists[0].role,
        id:userExists[0].id,
        email:userExists[0].email,
        name:userExists[0].firstName,
        authState: true,
        message: `User Login sucessfull! Welcome ${userExists[0].firstName}`,
      }
    }
  }
  
  static async getUsers() {
    const users = await this.UserRepo.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        activation: true
      },
      relations: {
        roles: true,
      },
      order: {
        lastName: 'ASC'
      },
      cache: true
    });
  
    return users;
  }
  
  static async fetchUsers() {
    /* none static method accessing the UserRepo */
    return await this.UserRepo.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });
  }
}