import typegoose,{ pre, prop, modelOptions, getModelForClass, index, Ref } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
@index({ email: 1 })
export class Invite {
    @prop({ required: true, trim: true })
    eventId: string = '';
    
    @prop({ required: true, trim: true })
    email: string = '';

    @prop({ required: true, enum: ['pending', 'accepted', 'declined'] })
    status: string = 'pending';
};
const inviteModel = getModelForClass(Invite);
export default inviteModel;