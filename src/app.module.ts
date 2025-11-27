import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { Tenant } from './entities/tenant.entity';
import { PsAuth } from './entities/ps-auth.entity';
import { PsAor } from './entities/ps-aor.entity';
import { PsEndpoint } from './entities/ps-endpoint.entity';
import { Extension } from '@app/entities/extension.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQL_HOST', '127.0.0.1'),
        port: parseInt(config.get<string>('MYSQL_PORT', '3306'), 10),
        username: config.get<string>('MYSQL_USER', 'root'),
        password: config.get<string>('MYSQL_PASSWORD', 'root'),
        database: config.get<string>('MYSQL_DATABASE', 'asterisk'),
        entities: [Tenant, PsAuth, PsAor, PsEndpoint, Extension],
        synchronize: config.get<string>('TYPEORM_SYNC', 'false') === 'true',
        logging: config.get<string>('TYPEORM_LOGGING', 'false') === 'true',
      }),
      inject: [ConfigService],
    }),
    TenantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
