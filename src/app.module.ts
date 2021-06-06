import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CautilService } from './services/cautil/cautil.service';
import { AppUtilService } from './services/app-util/app-util.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CautilService, AppUtilService],
})
export class AppModule {}
