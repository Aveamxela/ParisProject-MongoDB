import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: [true, "Email is required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email must be a valid email address"]
    },
    password: { 
        type: String,
        required: [true, "Password is required"],
    }
});

const User = mongoose.model('User', userSchema, 'Users');

export default User;
