import mongoose from 'mongoose';

const baladeSchema = new mongoose.Schema({
    nom: { 
        type: String,
        maxlength: [255, "Name must be at most 255 characters long"],
        match: [/^[a-zA-Zéèêëïôöûüàç\-\' ]+$/, "Name must contain only letters"]
    },
    arrondissement: { 
        type: Number,
        required: [true, "Arrondissement is required"],
        min: [1, "Arrondissement must be at least 1"],
        max: [20, "Arrondissement must be at most 20"]
    },
    texte_intro: { 
        type: String,
        required: [true, "Introduction text is required"],
        minlength: [5, "Introduction text must be at least 5 characters long"],
        maxlength: [1000, "Introduction text must be at most 1000 characters long"],
    },
    date_publication: { 
        type: Date,
        default: Date.now
    }
});

const Balade = mongoose.model('balades', baladeSchema);

export default Balade;
