import typegoose,{ pre, prop, modelOptions, getModelForClass, index, Ref } from "@typegoose/typegoose";

export class Payout {
    @prop({ required: true, trim: true })
    eventId: string = '';
    
    @prop({ required: true, trim: true })
    organizerId: string = '';

    @prop({ required: true, enum: ['Not paid', 'Paid'] })
    status: string = 'Not paid';
};
const payoutModel = getModelForClass(Payout);
export default payoutModel;