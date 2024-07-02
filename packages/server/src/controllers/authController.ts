import { Request, Response } from 'express'; 
import jwt from 'jsonwebtoken'; 
import User from '../models/user.models'; 
import Session from '../models/session.models';
import bcrypt from 'bcrypt'; 

const JWT_SECRET = 'SECRET'; 
const REFRESH_TOKEN_SECRET = 'SECRET_';

export const register = async (req: Request, res: Response) => {
    try {
        // express's body parser puts parameters in the body 
        const {name, email, password} = req.body; 
        if(!name || !email || !password){
            return res.status(400).json({status: 'error', message: 'Name, email, and pass can\'t be null'});
        }

        const existingUser = await User.findOne({email}); 
        
        if (existingUser){
            res.json({status: 'error', error: 'Duplciate Email'});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            username: name,
            email: email,
            password: hashedPassword,
          });
          res.status(201).json({ status: 'ok' });
    } catch (err){
        console.log(err); 
        res.json({status: 'error', error: 'Something went wrong while registering user.'});
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password}  = req.body;
        const user = await User.findOne({ email }); 
        if (user && await bcrypt.compare(password, user.password)) {
            await Session.deleteMany({ userId: user._id });

            const accessToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h'});
            const refreshToken = jwt.sign({userId: user._id, email: user.email }, REFRESH_TOKEN_SECRET, {expiresIn: '7d'}); 

            await Session.create({ userId: user._id, refreshToken }); 

            res.json({ status: 'ok', accessToken, refreshToken }); 
        } else {
            res.status(401).json({status: 'error', message: 'Invalid credentials'}); 
        }
    } catch (err) {
        console.error(err); 
        res.status(500).json({ status: 'error', message: 'Server error'}); 
    }
}


export const logoout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body; 

        if(!refreshToken) { 
            return res.status(400).json({ status: 'error', message:'Refresh token required '}); 
        }

        await Session.deleteOne({ refreshToken }); 

        res.json({ status: 'ok', message: 'Logged out successfully'}); 
    } catch (err) {
        console.error(err); 
        res.status(500).json({status: 'error', message: 'Server error'}); 
    }
}