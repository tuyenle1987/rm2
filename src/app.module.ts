import { Module, MiddlewareConsumer, RequestMethod, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HttpLoggerMiddleware } from '@nest-toolbox/http-logger-middleware';
import {
  CorrelationIdMiddleware,
  CorrelationModule,
} from '@evanion/nestjs-correlation-id';

import { MongooseModule } from '@nestjs/mongoose';

import appConfig from './configs/app.config';
import dbConfig from './configs/db.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CompanyController } from './company/company.controller';
import { CompanySchema } from './schemas/company.schema';
import { CompanyService } from './company/company.service';
import { ReviewerController } from './reviewer/reviewer.controller';
import { ReviewerSchema } from './schemas/reviewer.schema';
import { ReviewerService } from './reviewer/reviewer.service';

console.log('MONGO_URL', process.env.MONGO_URL);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: 'Company', schema: CompanySchema },
      { name: 'Reviewer', schema: ReviewerSchema }
    ]),
    HttpModule,
    CorrelationModule.forRoot(),
  ],
  controllers: [AppController, CompanyController, ReviewerController],
  providers: [
    AppService,
    CompanyService,
    ReviewerService,
    Logger,
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(HttpLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
