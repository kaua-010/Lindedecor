import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validarUser(email: string, senha: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user && await bcrypt.compare(senha, user.senha)) return user;
    return null;
  }

  async login(user: User) {
    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email }) };
  }

  async registrar(nome: string, email: string, senha: string) {
    const existe = await this.userRepo.findOne({ where: { email } });
    if (existe) throw new Error('E-mail já cadastrado');
    const hash = await bcrypt.hash(senha, 10);
    const user = this.userRepo.create({ nome, email, senha: hash });
    return this.userRepo.save(user);
  }

  async validarToken(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
