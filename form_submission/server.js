const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => console.log("MongoDB successfully connected"))
.catch((err)=>console.error("MongoDB Connection is refused or .env file is not present:",err))

const ContactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    dob: {type: Date, required: true},
    age: {type: Number, required: true}
}, {
    timestamps: true
});

const Contact = mongoose.model("Contact", ContactSchema);

// Middleware for frontend folder
app.use(express.static(path.join(__dirname, 'public')))
// Middleware for url extension
app.use(express.urlencoded({extended: true}))
app.use(express.json());

// Home Page routing
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, public, index.html));
})

// Form Page routing
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,public, 'forms.html'));
})

// About page Routing
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,public, 'about.html'))
})

app.post('/submit-form',async(req,res)=>{
    try{
        const{ name, phone,age,dob,email}=req.body;

        if(!name || !phone || !email || !age || !dob){
            return res.status(400).send("all fields are required and should not be")
        }

        const parsedDB = new Date(dob);
        const newContact = new Contact(
            {
                name,
                phone,
                age: parseInt(age),
                dob: parsedDB,
                email
            }
        );

        await newContact.save();

        console.log(`Contact saved: ${newContact.email}`);

        res.status(200).send('<body style = "font-family: sans-serif; text-align: center; padding: 50px;"><h1>Success<h1><p>Contact information saved in MongoDB</p> <a href ="/">Return to Home Page</a></body>')
    }
    catch(error){
        console.error("Error saving the contacct", error);

        if(error.code === 11000){
            return res.status(409).send('<body style = "font-family: sans-serif; text-align: center;"><p>The email is already registered</p></body>')
        }
        res.status(500).send('Internal server Error: Could not send the data')
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})