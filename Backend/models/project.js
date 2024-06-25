import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;