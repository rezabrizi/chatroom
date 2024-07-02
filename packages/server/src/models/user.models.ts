import {Schema, model, Document} from 'mongoose'; 

interface IUser extends Document {
    username: string; 
    password: string; 
    email: string; 
    createdAt: Date; 
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password : {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
}, {collection: 'user-data'}
) 
const User = model<IUser>('User', userSchema);
export default User;