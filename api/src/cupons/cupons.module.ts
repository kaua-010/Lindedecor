import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cupom } from './entities/cupom.entity';
import { CuponsService } from './cupons.service';
import { CuponsController } from './cupons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cupom])],
  providers: [CuponsService],
  controllers: [CuponsController],
})
export class CuponsModule {}
