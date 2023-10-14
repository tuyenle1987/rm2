import { Module, MiddlewareConsumer, RequestMethod, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
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

import { AuthzModule } from './auth/authz.module';

import { CompanyController } from './company/company.controller';
import { CompanySchema } from './schemas/company.schema';
import { CompanyService } from './company/company.service';
import { ReviewerController } from './reviewer/reviewer.controller';
import { PendingController } from './pending/pending.controller';
import { PendingService } from './pending/pending.service';
import { ReviewerSchema } from './schemas/reviewer.schema';
import { ReviewerService } from './reviewer/reviewer.service';
import { ReviewController } from './review/review.controller';
import { ReviewSchema } from './schemas/review.schema';
import { PendingSchema } from './schemas/pending.schema';
import { ReviewService } from './review/review.service';
import { HistoryController } from './history/history.controller';
import { HistoryService } from './history/history.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    AuthzModule,
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
      { name: 'Pending', schema: PendingSchema },
    ]),
    HttpModule,
    CorrelationModule.forRoot(),
  ],
  controllers: [
    AppController,
    CompanyController,
    ReviewerController,
    ReviewController,
    HistoryController,
    PendingController,
  ],
  providers: [
    AppService,
    CompanyService,
    ReviewerService,
    ReviewService,
    PendingService,
    HistoryService,
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
