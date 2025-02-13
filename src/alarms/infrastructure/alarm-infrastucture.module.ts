import { Module } from '@nestjs/common';
import { OrmAlarmPersistenceModule } from './persistence/orm/orm-persistence.module';
import { InMemoryAlarmRepositoryModule } from './persistence/in-memory/in-memory-persistence.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  exports: [SharedModule],
})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModel =
      driver === 'orm'
        ? OrmAlarmPersistenceModule
        : InMemoryAlarmRepositoryModule;
    return {
      module: AlarmsInfrastructureModule,
      imports: [persistenceModel],
      exports: [persistenceModel],
    };
  }
}
