import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PermissionMiddleware } from './common/middleware/permission.middleware';
import { RolePermissionModule } from './modules/permissionRbac/rolePermissionMapping/role-permission.module';

@Module({
  imports: [
    AttendanceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // CacheModule.register({ isGlobal: true, store: MemoryStore }),
    RolePermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PermissionMiddleware)
      .exclude(
        {
          path: 'api/v1/role-permission/create',
          method: RequestMethod.POST,
        }, // Exclude POST /auth/login
        {
          path: 'api/v1/role-permission/get',
          method: RequestMethod.POST,
        }, // Exclude POST /auth/login
        {
          path: 'notification/v1/role-permission/update',
          method: RequestMethod.POST,
        }, // Exclude POST /auth/login
        // Exclude GET /health
      )
      .forRoutes('*'); // Apply middleware to the all routes
  }
}
