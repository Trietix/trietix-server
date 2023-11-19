import typegoose,{ pre, prop, modelOptions, getModelForClass, index, Ref } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})

export class Request {
    @prop({ trim: true })
    reason: string = '';

    @prop({ trim: true })
    associationName: string = '';

    @prop({ trim: true })
    universityName: string = '';
    
    @prop({ trim: true })
    nin: string = '';
   
    @prop({ trim: true })
    driverLicense: string = '';

    @prop({ trim: true })
    presidentId: string = '';

    @prop({ required: true, trim: true })
    organizerId: string = '';

    @prop({ required: true, enum: ['university', 'corporate'] })
    type: string = 'university';
   
    @prop({ required: true, enum: ['accepted', 'declined', 'pending'] })
    status: string = 'pending';
};
const RequestModel = getModelForClass(Request);
export default RequestModel;