import typegoose,{ pre, prop, modelOptions, getModelForClass, index, Ref } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
@index({ email: 1 })

export class Ticket {
    @prop({ required: true, trim: true })
    email: string = '';
    
    @prop({ required: true, trim: true })
    amount: number = 0;

    @prop({ required: true, trim: true })
    ticketId: string = '';

    @prop({ required: true, trim: true })
    price: number = 0;

    @prop({ required: true, trim: true })
    processingFee: number = 0;

    @prop({ required: true, trim: true })
    event: string = '';

    @prop({ trim: true })
    noOfCheckedIn: number = 0

    @prop({ required: true, trim: true })
    isCheckedIn: boolean = false;

    @prop()
    user: string = '';
};
const ticketModel = getModelForClass(Ticket);
export default ticketModel;
