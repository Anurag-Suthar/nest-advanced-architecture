import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.event';
import { UpsertMaterializedAlarmRepository } from '../ports/upsert-materialized-alarm.repository';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreateEventHandler
  implements IEventHandler<AlarmCreatedEvent>
{
  private readonly logger = new Logger(AlarmCreateEventHandler.name);
  constructor(
    private readonly upsertMaterializedAlarmRepository: UpsertMaterializedAlarmRepository,
  ) {}
  async handle(event: AlarmCreatedEvent) {
    this.logger.log(`Alarm created event: ${JSON.stringify(event)}`);

    // In a real-world application, we would have to ensure that this operation is atomic
    // with the creation of the alarm.Otherwise, we could end up with an alarm that is not reflected
    // in the read model (e.g. because the database operation fails).
    // For more information,check out "Transactional index/outbox pattern".
    // For more information, check out "Transactional inbox/outbox pattern".

    await this.upsertMaterializedAlarmRepository.upsert({
      id: event.alarm.id,
      name: event.alarm.name,
      severity: event.alarm.severity.value,
      triggeredAt: event.alarm.triggeredAt,
      isAcknowledged: event.alarm.isAcknowledged,
      items: event.alarm.items,
    });
  }
}
