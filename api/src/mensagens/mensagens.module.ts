import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensagem } from './entities/mensagem.entity';
import { MensagensService } from './mensagens.service';
import { MensagensController } from './mensagens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mensagem])],
  providers: [MensagensService],
  controllers: [MensagensController],
})
export class MensagensModule {}
