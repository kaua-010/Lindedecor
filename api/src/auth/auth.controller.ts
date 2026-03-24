import { Controller, Post, Body, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; senha: string }) {
    const user = await this.auth.validarUser(body.email, body.senha);
    if (!user) throw new UnauthorizedException('Email ou senha inválidos');
    return this.auth.login(user);
  }

  @Post('registrar')
  async registrar(@Body() body: { nome: string; email: string; senha: string }) {
    return this.auth.registrar(body.nome, body.email, body.senha);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: User) {
    const { senha, ...rest } = user;
    return rest;
  }
}
