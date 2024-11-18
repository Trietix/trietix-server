import typegoose,{ pre, prop, modelOptions, getModelForClass, index, Ref } from "@typegoose/typegoose";
import { Ticket } from '../ticket/ticket.model';
import { User } from "../user";

const categories = ['conferences', 'concerts_and_music', "sports_and_fitness", "arts_and_culture", "workshops_and_seminars", "food_and_drink", "community_and_networking", "health_and_wellness", "technology_and_innovation", "travel_and_adventure", "fashion_and_beauty", "gaming_and_entertainment", "science_and_technology", "family_and_kids", "environment_and_sustainability", "business_and_entrpreneurship", "hobbies_and_interests", "music_and_dance", "religious_and_spiritual", "holiday_and_sesonal"];
@modelOptions({
    schemaOptions: {
        timestamps: true
    }
})
@index({ email: 1 })
export class Event {
    @prop({ required: true, trim: true })
    title: string = '';

    @prop({ default: null, trim: true })
    url: string = '';
    
    @prop({ required: true, trim: true })
    description: string = '';

    @prop({ required: true, trim: true })
    location: string = '';
    
    @prop({ required: true, trim: true })
    color: string = '';

    @prop({ required: true, trim: true })
    venue: string = '';

    @prop({ required: true, trim: true })
    startTime: string = '';
    
    @prop({ required: true, trim: true })
    endTime: string = '';

    @prop()
    invites: string[] = [''];

    @prop({ required: true, trim: true })
    date: string = '';

    @prop({ required: true, trim: true })
    price: number = 0;
    
    @prop({ required: true, trim: true })
    processingFee: number = 0;

    @prop({ trim: true })
    tickets: string[] = [''];

    @prop({ required: true, trim: true })
    organizer: string = '';

    @prop({ required: true, trim: true })
    image: string = '';

    @prop({ trim: true })
    socials: string[] = [''];

    @prop({ trim: true })
    isStarted: boolean = false;

    @prop({ trim: true })
    isEnded: boolean = false;

    @prop({ trim: true })
    isCancelled: boolean = false;

    @prop({ trim: true })
    checkedIn: string[] = [''];

    @prop({ required: true, trim: true })
    category: string[] = [''];
};
const eventModel = getModelForClass(Event);
export default eventModel;