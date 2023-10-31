"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const categories = ['conferences', 'concerts_and_music', "sports_and_fitness", "arts_and_culture", "workshops_and_seminars", "food_and_drink", "community_and_networking", "health_and_wellness", "technology_and_innovation", "travel_and_adventure", "fashion_and_beauty", "gaming_and_entertainment", "science_and_technology", "family_and_kids", "environment_and_sustainability", "business_and_entrpreneurship", "hobbies_and_interests", "music_and_dance", "religious_and_spiritual", "holiday_and_sesonal"];
let Event = class Event {
    constructor() {
        this.title = '';
        this.description = '';
        this.location = '';
        this.color = '';
        this.venue = '';
        this.time = '';
        this.invites = [''];
        this.date = '';
        this.price = 0;
        this.processingFee = 0;
        this.tickets = [''];
        this.organizer = '';
        this.image = '';
        this.socials = [''];
        this.started = false;
        this.checkedIn = [''];
        this.category = [''];
    }
};
exports.Event = Event;
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "color", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "venue", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "time", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], Event.prototype, "invites", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "date", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", Number)
], Event.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", Number)
], Event.prototype, "processingFee", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", Array)
], Event.prototype, "tickets", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "organizer", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Event.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", Array)
], Event.prototype, "socials", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "started", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", Array)
], Event.prototype, "checkedIn", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", Array)
], Event.prototype, "category", void 0);
exports.Event = Event = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true
        }
    }),
    (0, typegoose_1.index)({ email: 1 })
], Event);
;
const eventModel = (0, typegoose_1.getModelForClass)(Event);
exports.default = eventModel;
