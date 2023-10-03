import { Module, MiddlewareConsumer, RequestMethod, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ReviewController } from './review/review.controller';
import { ReviewSchema } from './schemas/review.schema';
import { ReviewService } from './review/review.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const mongoUrl = config.get<string>('mongoUrl');
        return {
          uri: mongoUrl,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Company', schema: CompanySchema },
      { name: 'Reviewer', schema: ReviewerSchema },
      { name: 'Review', schema: ReviewSchema },
    ]),
    HttpModule,
    CorrelationModule.forRoot(),
  ],
  controllers: [
    AppController,
    CompanyController,
    ReviewerController,
    ReviewController,
  ],
  providers: [
    AppService,
    CompanyService,
    ReviewerService,
    ReviewService,
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
