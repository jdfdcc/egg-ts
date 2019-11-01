import { Application } from 'egg';

export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userName: {
      type: String,
      unique: false, // 是否是唯一的key
      required: true,
    },
  });
  return mongoose.model('User', UserSchema);
};
