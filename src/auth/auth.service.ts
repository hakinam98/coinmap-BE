import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
export const roundsOfHashing = 10;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`User not found by email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return {
      authToken: this.jwt.sign({
        userID: user.id,
      }),
      user: user,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthEntity> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: signUpDto.email,
      },
    });

    if (user) {
      throw new NotAcceptableException('Email extisted!');
    }
    const hashedPassword = await bcrypt.hash(
      signUpDto.password,
      roundsOfHashing,
    );
    signUpDto.password = hashedPassword;

    const newUser = await this.prisma.users.create({
      data: signUpDto,
    });

    return {
      authToken: this.jwt.sign({ userId: newUser.id }),
      user: newUser,
    };
  }
}
