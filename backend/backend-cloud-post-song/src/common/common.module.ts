import { Module } from '@nestjs/common';
import { SpringClientService } from './spring-client/spring-client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],               // ← COMA al final ✔
  providers: [SpringClientService],    // ← COMA al final ✔
  exports: [SpringClientService],      // ← COMA al final ✔
})
export class CommonModule {}
