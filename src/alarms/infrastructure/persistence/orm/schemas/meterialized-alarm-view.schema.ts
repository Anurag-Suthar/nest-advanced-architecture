import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Data } from 'ws';

@Schema()
export class MaterializedAlarmView extends Document {
  @Prop({ unique: true, index: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  severity: string;

  @Prop({ type: Date })
  triggeredAt: Data;

  @Prop(raw([{ id: String, name: String, type: { type: String } }]))
  items: Array<{ id: string; name: string; type: string }>;
}

export const MaterializedAlarmViewSchema = SchemaFactory.createForClass(
  MaterializedAlarmView,
);
