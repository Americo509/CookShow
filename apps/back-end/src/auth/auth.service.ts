import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SharedUtilServer } from '@cook-show/shared/util-server';
import { HttpStatusCode } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly sharedUtilServer: SharedUtilServer,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if(!user) {
      throw new HttpException('Usuário não encontrado',HttpStatusCode.NotFound)
    }
    if (await this.sharedUtilServer.compare(signInDto.senha, user?.senha) === false) {
      throw new HttpException('Senha inválida',HttpStatusCode.Unauthorized)
    }

    try {
      const payload = { id: user?.id, username: user?.usuario };
      const access_token = await this.jwtService.signAsync(payload);

      return access_token;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
