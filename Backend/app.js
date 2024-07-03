import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Project from "./models/project.js";
import Material from './models/material.js';
import {MongoClient} from "mongodb";

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
const uri = process.env.MONGODB_URI || "mongodb+srv://nspp3305:NSPP3305@accountdb.cjvhgg1.mongodb.net/?retryWrites=true&w=majority&appName=AccountDB";
async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db("Business-Accounting");
        const collection =  database.collection("test");
        console.log("MongoDB connected");
    }catch(er){
        console.log(er);
    } finally {
        await client.close();
    }
}

main();
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
    origin: "https://accounts-for-business-2bed.vercel.app",
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/add_project', async (req, res) => {
    const { name, start_date, end_date } = req.body;
    const newProject = new Project({ name, start_date, end_date });
    try {
        await newProject.save();
        res.status(200).send('New project added successfully');
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).send('Server error');
    }
});

app.post('/add_material', async (req, res) => {
    const { project_id, material_name, quantity, cost_per_unit } = req.body;
    const newMaterial = new Material({ project_id, material_name, quantity, cost_per_unit });
    try {
        await newMaterial.save();
        res.status(200).send('Material added successfully');
    } catch (error) {
        console.error('Error adding material:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        console.log(projects);
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/materials/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const materials = await Material.find({ project_id: projectId });
        res.json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).send('Server error');
    }
});

app.use("/" , (_,res) => res.status(404).json({Hello : "Nirmal Patel"}))
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;
