import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';

import { Logger } from '@nestjs/common';
import { AlarmFactory } from '../../domain/factories/alarm.factory';
import { CreateAlarmRepository } from '../ports/create-alarm.repository';
import { CreateAlarmCommand } from './create-alarm.command';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.event';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    // private readonly alarmRepository: CreateAlarmRepository,
    private readonly alarmFactory: AlarmFactory,
    // private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(
      `Processing "CreateAlarmCommand": ${JSON.stringify(command)}`,
    );
    const alarm = this.alarmFactory.create(
      command.name,
      command.severity,
      command.triggered,
      command.items,
    );
    // const newAlarm = await this.alarmRepository.save(alarm);
    // // This is not yet the best way to dispatch events.
    // // Domain events should be dispatched from the aggregate root, inside the domain layer.
    // // We'll cover this in the upcoming lessons.
    // this.eventBus.publish(new AlarmCreatedEvent(alarm));

    this.eventPublisher.mergeObjectContext(alarm);
    alarm.commit();

    return alarm;
  }
}
