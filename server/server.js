import express from 'express';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import { createCanvas, loadImage } from 'canvas';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { Readable } from 'stream';
dotenv.config({ path: './.env.googleOauth' });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

db.settings({ ignoreUndefinedProperties: true });

console.log('Firebase connected');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const app = express()
const port =  process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });

console.log('Starting server with Google OAuth credentials:');
console.log('Google Client ID:', CLIENT_ID);
console.log('Google Client Secret:', CLIENT_SECRET);


app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL
    ],
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({

    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    scope: [
        'profile', 
        'email', 
        'https://www.googleapis.com/auth/drive.file',
        'https://mail.google.com/'
    ]
    
},
async(accessToken, refreshToken, profile, done) => {

    console.log('Google profile:', profile);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    const userRef = db.collection('users').doc(profile.id);
    const doc = await userRef.get();

    if(!doc.exists){

        console.log('Creating new user in Firestore');
        const userData = {

            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            accessToken: accessToken,
            refreshToken: refreshToken || null,

        };

        await userRef.set(userData);
        return done(null, userData);

    }else{

        console.log('Updating existing user in Firestore');

        await userRef.update({

            accessToken: accessToken,
            
        })

        const userData = doc.data();
        userData.accessToken = accessToken;


    return done(null, userData);
    }

}));

passport.serializeUser((user, done) => {

    done(null, user.googleId);

});

passport.deserializeUser(async (id, done) => {
    
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();

    if(doc.exists){
        
        done(null, doc.data());

    }else{

        done(new Error('User not found'), null);

    }

});

app.get('/auth/google', 
    passport.authenticate('google', {

        scope: [

            'profile',
            'email',
            'https://www.googleapis.com/auth/drive.file', 
            'https://mail.google.com/'

        ],
        accessType: 'offline',
        prompt: 'consent'

    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login`,
        successRedirect: `${process.env.CLIENT_URL}/dashboard`
    })
);

app.get('/api/me', (req, res) => {

    if(req.isAuthenticated()){

        res.json({ user: req.user });

    }else{

        res.status(401).json({ error: 'You are not logged in' });

    }

});

app.post('/api/events', async (req, res) => {

    if(!req.isAuthenticated()){

        return res.status(401).json({ error: 'You are not logged in' });

    }

    const userId = req.user.googleId;

    const { eventName, eventDate } = req.body;

    const newEvent = {

        eventName: eventName,
        eventDate: eventDate,
        userId: userId,
        createdAt: new Date()

    };

    const eventRef = await db.collection('events').add(newEvent);

    res.status(201).json({
        message: 'Event created',
        eventId: eventRef.id
    
    });

})

app.get('/api/events', async (req, res) =>{

    if(!req.isAuthenticated()){

        return res.status(401).json({ error: 'You must be logged in.' });

    }

    const userId = req.user.googleId;

    const eventsRef = db.collection('events');
    const snapshot = await eventsRef.where('userId', '==', userId).get();

    if(snapshot.empty){
        return res.json([]);
    }

    const userEvents = [];
    snapshot.forEach(doc => {
        userEvents.push({
            id: doc.id,
            ...doc.data()
        });
    });

    res.json(userEvents);
});

app.get('/auth/logout', (req, res, next) => {

    req.logout(function(err) {

        if(err){

            return next(err);

        }

        req.session.destroy((err) => {

            if(err){

                console.log('Error destroying session', err);

            }

            res.clearCookie('connect.sid');

        res.json({ message: 'Logged out succeessfully'});
        });

    });

});

async function sendEmail(user, toEmail, toName, eventName, certificateBuffer){

    try{

        const transporter = nodemailer.createTransport({

            service: 'gmail',
            auth: {

                type: 'OAuth2',
                user: user.email,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: user.refreshToken,
                accessToken: user.accessToken

            }

        });

        const mailOptions = {

            from: user.email,
            to: toEmail,
            subject: `Certificate for ${eventName}`,
            html: `
            <p>Hello ${toName}</p>
            <p>We are presenting this certificate of recognition for attending the event ${eventName}. Below is your attached certificate, once again, thank you for your participation!</p>
            `,
            attachments: [
                {
                    filename: `${toName}_${eventName}_certificate.png`,
                    contentType: 'image/png',
                    content: certificateBuffer,
                },
            ],

        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent to ", toEmail);

    }catch(error){

        console.error("Error sending email: ", error);

    }

}

async function setFolder(user, folderName){

    try{

        const oauth2Client = new google.auth.OAuth2(

            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET

        );

        oauth2Client.setCredentials({

            access_token: user.accessToken,
            refresh_token: user.refreshToken,

        });

        const drive = google.drive({ 
            
            version: 'v3', 
            auth: oauth2Client 
        
        });

        const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false and 'root' in parents`;
        const res = await drive.files.list({

            q: query,
            fields: 'files(id)',
            spaces: 'drive',

        });

        if(res.data.files.length > 0){

            return res.data.files[0].id;

        }else{

            const fileMetaData = {

                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',

            };
            const folder = await drive.files.create({

                resource: fileMetaData,
                fields: 'id',

            });
            return folder.data.id;
        }

    }catch(error){

        console.error("Error getting folder: ", error);
        return null;

    }

}

async function uploadToFolder(user, folderId, certificateBuffer, fileName){

    try{

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );

        oauth2Client.setCredentials({

            access_token: user.accessToken,
            refresh_token: user.refreshToken,
        
        });

        const drive = google.drive({

            version: 'v3',
            auth: oauth2Client

        });

        const bufferStream = new Readable();
        bufferStream.push(certificateBuffer);
        bufferStream.push(null);

        const response = await drive.files.create({

            requestBody: {

                name: fileName,
                mimeType: 'image/png',
                parents: [folderId],

            },
            media: {

                mimeType: 'image/png',
                body: bufferStream,

            },

        });

        console.log('File Upload Successful: ', response.data.id);

    }catch(error){

        console.error("Erorr Uploading: ", error);

    }

}

app.post('/api/generate', upload.fields([

        { name: 'templateFile', maxCount: 1 },
        { name: 'csvFile', maxCount: 1 }

    ]), async (req, res) => {

        if(!req.isAuthenticated()){
            return res.status(401).json({ error: 'You are not logged in' });
        }

        try{

            const yPercent = parseFloat(req.body.yPosition);
            const fontSize = parseInt(req.body.fontSize, 10);
            const font = `${fontSize}px Arial`;
            const eventName = req.body.eventName;
            const user = req.user;
            const fontColor = req.body.fontColor || '#000000';

            const templatePath = req.files.templateFile[0].path;
            const csvPath = req.files.csvFile[0].path;

            console.log('Storing event to Firestore');
            const userId = req.user.googleId;
            const newEvent = {

                eventName: req.body.eventName,
                eventDate: req.body.eventDate,
                userId: userId,
                createdAt: new Date(),
                settings: { yPercent, fontSize, fontColor }

            };

            await db.collection('events').add(newEvent);
            console.log('Event stored in Firestore');

            const folderId = await setFolder(user, eventName);

            const image = await loadImage(templatePath);

            fs.createReadStream(csvPath)
            .pipe(csvParser())
            .on('data', async (row) => {

                const name = row.Name;
                const email = row.Email;

                if(!name || !email){

                    console.warn('Skipping invalid row: ', row);
                    return;

                }

                const canvas = createCanvas(image.width, image.height);
                const ctx = canvas.getContext('2d');

                ctx.drawImage(image, 0, 0);
                
                const fontName = req.body.fontStyle || 'Arial';
                ctx.font = `bold ${fontSize}px "${fontName}"`;
                ctx.fillStyle = fontColor;
                ctx.textAlign = 'center';

                ctx.textBaseline = 'middle';

                const yPx = canvas.height * (yPercent/100);

                ctx.fillText(name, canvas.width / 2, yPx);

                const buffer = canvas.toBuffer('image/png');

                await sendEmail(user, email, name, eventName, buffer);

                const fileName = `${eventName}_${name}.png`;
                if(folderId){

                    await uploadToFolder(user, folderId, buffer, fileName);

                }

                console.log('Generated Certificate for ', name);

            })
            .on('end', () => {

                fs.unlinkSync(templatePath);
                fs.unlinkSync(csvPath);

            res.status(200).json({ message: 'Successfully Generated Certificate'});
            });

        } catch (err) {

            console.error('Error Generating Certificates: ',err);
            res.status(500).json({ error: 'Internal Server Error' });

        }

});

app.delete('/api/events/:id', async (req, res) => {

    if(!req.isAuthenticated()){

        return res.status(401).json({error: 'You are not logged in'});

    }

    try{

        const eventId = req.params.id;
        
        await db.collection('events').doc(eventId).delete();

        console.log(`Event ${eventId} deleted`);
        res.json({ message: 'Event successfully removed' });

    }catch(error){

        console.error('Error deleting event: ', error);
        res.status(500).json({ error: 'Failed to delete event' });

    }

});

app.listen(port, () => {

    console.log(`Server is running on port ${port}`);

});