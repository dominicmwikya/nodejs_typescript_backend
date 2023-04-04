import { User } from '../entities/User.entity';
import { databaseConfig } from '../dbconfig';
import bcrypt from 'bcrypt';
import userData from '../../interfaces/user';
import Jwt from 'jsonwebtoken';
import { Mailservice } from '../../helpers/mail.service';
import { Role } from '../entities/Role.entity';

export default class UserRepository {
  private static UserRepo = databaseConfig.getRepository(User);
  private static RoleRepo = databaseConfig.getRepository(Role);

  private static passwordEncrypt(password: string): string {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  private static passwordDecrypt(password: string, user: User): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  private static generateUserToken(user: User): any {
    const expirationTimeInSeconds = 60 * 60; // 1 hour in seconds
    const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const expirationTime = currentTime + expirationTimeInSeconds;
    const my_secret_key: any = process.env.SECRET_KEY_API_KEY;

    const payload: object = {
      id: user.id,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
    };
    const token: string = Jwt.sign({ payload, exp: expirationTime }, my_secret_key);

    return { accessToken: token, expirytime: expirationTime, user: payload };
  }

  private static generateRandomString(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  static async registerUser(user: User, roleId: any): Promise<User | undefined> {
    const exists = await this.UserRepo.findOneBy({
      email: user.email,
    });

    if (exists) {
      throw new Error(`User with ${user.email} already exists! Choose new email`);
    }

    const role: Role | null = await this.RoleRepo.findOneBy({ id: roleId });

    if (!role) {
      throw new Error(`Role with id ${roleId} not found`);
    }

    let uniquestring = this.generateRandomString();
    user.password = this.passwordEncrypt(user.password);
    user.roles = [role];
    user.code = uniquestring;

    const mailService = new Mailservice();

    try {
      const result: User | null = await this.UserRepo.save(user);
      await mailService.sendEmail(
        user.email,
        'Email Confirmation',
        `<a href='http://localhost:8000/users/verify/${uniquestring}'> click here </a>`
      );
      return result;
    } catch (err: any) {
      console.error(`Failed to create user or send email to ${user.email}: ${err}`);
      throw new Error('Error creating the user or sending confirmation email');
    }
  }

  static async verifyCode<User>(code: string): Promise<User | any> {
    const userResult = await this.UserRepo.find({ where: { code: code } });
  
    if (!userResult) { 
      throw new Error(`Invalid activation ${code}`);
    }
  
    userResult[0].activation = true;
    userResult[0].code = '';
  
    try {
      await this.UserRepo.save(userResult);
  
      const mailService = new Mailservice();
      await mailService.sendEmail(
        userResult[0].email,
        'Account activated successfully! Click here to login',
        `<a href=http://localhost:3000/login> Login here </a>`
      );
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