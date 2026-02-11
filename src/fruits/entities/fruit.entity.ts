import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { HydratedDocument } from 'mongoose';

// Sub-document for Regional Varieties
@Schema()
export class Variety {
  @Prop({ required: true })
  name: string; // e.g., 'Alphonso', 'Kesar'

  @Prop()
  description?: string;

  @Prop()
  image?: string; // URL to image
}

export const VarietySchema = SchemaFactory.createForClass(Variety);

export type FruitDocument = HydratedDocument<Fruit>;

@Schema({ timestamps: true })
export class Fruit {
  @Prop({ required: true, unique: true })
  name: string; // e.g., 'Mango', 'Banana'

  @Prop({ default: 'Generic description' })
  description: string;

  @Prop({ type: [VarietySchema], default: [] })
  varieties: Variety[]; // Embedded array of varieties
}

export const FruitSchema = SchemaFactory.createForClass(Fruit);
FruitSchema.plugin(mongoosePaginate);
