import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import tokenTypes from './token.types';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@index({ user: 1 })

export class Token {
  @prop({ required: true })
  token: string = '';

  @prop()
  user: string = '';

  @prop({ required: true, enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL] })
  type: string = '';

  @prop({ required: true })
  expires: Date = null!;
  
  @prop({ default: false })
  blacklisted: boolean = false;
};

const TokenModel = getModelForClass(Token);
export default TokenModel;