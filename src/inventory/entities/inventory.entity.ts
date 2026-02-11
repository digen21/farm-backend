// inventory/schemas/inventory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ timestamps: true })
export class Inventory {
  // WHO is selling?
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  seller: Types.ObjectId;

  // WHAT Fruit Category? (Reference to Master Fruit Document)
  @Prop({ required: true, type: Types.ObjectId, ref: 'Fruit' })
  fruit: Types.ObjectId;

  // WHICH Variety? (We store the NAME because it's a sub-document)
  // Logic: The system must verify this name exists inside the Fruit.varieties array
  @Prop({ required: true })
  varietyName: string;

  // --- SELLER SPECIFIC DATA ---

  @Prop({ required: true })
  pricePerKg: number; // Farmer sets this price

  @Prop({ required: true })
  availableStock: number; // Farmer sets this stock kg

  @Prop()
  harvestDate: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
InventorySchema.plugin(mongoosePaginate);
