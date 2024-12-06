import express, { Router } from "express"
import { isValidId } from "../middleware/isValidId.js";
import Balade from "../models/Balade.js";
import { availableBalade } from "../middleware/availableBalade.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const balades = await Balade.find();
        res.render('balades/list', { error: "",info: "", balades: balades });
    } catch (err) {
        res.status(500).send('Erreur serveur : ' + err.message);
    }
});

//details balade by id
router.get('/id/:id', isValidId("Details balade"), availableBalade("Details balade"), async (req, res) => {
    try {
        const { id } = req.params;
        const balade = await Balade.findOne({ _id: id });
        res.render("balades/detail.ejs", { error : "", balade: balade });
    } catch (err) {
        res.status(500).send('Erreur serveur : ' + err.message);
    }
});

//Search by text_intro
router.get('/search', async (req, res) => {
    try {
        const { search } = req.query;

        const balades = await Balade.find({
            texte_intro: { $regex: search, $options: 'i' } // i ignore la casse
        });
        if (balades.length === 0) {
            const allBalades = await Balade.find();
            return res.render('balades/list.ejs', {
                error: `No results for search`, info: "",
                info: "",
                balades: allBalades});
        }

        res.render('balades/list.ejs', {error: "", info:`Voici les ballades disponibles comprenant : ${search}`, balades: balades });
    } catch (err) {
        res.status(500).send('Erreur serveur : ' + err.message);
    }
});

//Count by arrondissement
router.get('/arrondissement', async (req, res) => {
    try{
        const { arrondissement } = req.query;
        const balades = await Balade.find({ arrondissement: arrondissement });
        const nombreBalades = balades.length;
        if (nombreBalades === 0) {
            const allBalades = await Balade.find();
            return res.render('balades/list.ejs', {
                error: `None balades in arrondissement ${arrondissement}`,
                info: "",
                balades: allBalades
            });
        }
        res.render('balades/list.ejs', {
            balades: balades,
            info: `Il y a ${nombreBalades} balade(s) dans l'arrondissement ${arrondissement}`,
            error: ""
        });
    } catch (err) {
        res.status(500).send('Erreur serveur : ' + err.message);
    }
});

//resume by arrondissement
router.get('/synthese', async (req, res) => {
    try {
        const synthese = await Balade.aggregate([
            { $group: { _id: '$arrondissement', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);
        if(synthese.length === 0) {
            return res.render('balades/synthese', { error: `None arrondissement`, synthese: [] });
        }
        res.render('balades/synthese', {error: "", synthese });
    } catch (err) {
        res.status(500).send('Erreur serveur : ' + err.message);
    }
});

//Add balade
router.get("/add", isAuthenticated, function(req,res){
    res.render("balades/addOrEdit.ejs", { error : "", balade: {} });
})
router.post('/add', isAuthenticated, async (req, res) => {
    const { nom, arrondissement, texte_intro } = req.body;
    if (!arrondissement || !texte_intro) return res.status(400).render("addOrEdit.js", { error: "Please fill in all fields", balade: { nom, arrondissement, texte_intro } });
    try {
        const newBalade = new Balade({ nom, arrondissement, texte_intro });
        await newBalade.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).render("balades/addOrEdit.ejs", { error: err.message, balade : req.body || {} });
    }
});

//Update balade
router.get("/update/:id",isAuthenticated, isValidId("Modification") , availableBalade("Modification"), async function (req, res) {
    const { id } = req.params;
    const balade = await Balade.findOne({_id : id});
    if (!balade) {
        return res.status(404).send("Balade not found");
    }
    res.render("balades/addOrEdit.ejs", { error : "", balade });
})
router.post('/update-one/:id',isAuthenticated, isValidId("Modification"), availableBalade("Modification"), async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, arrondissement, texte_intro } = req.body;
        const updateData = { nom, arrondissement, texte_intro };
        const updatedBalade = await Balade.updateOne({ _id: id }, updateData);
        if (!updatedBalade) return res.status(404).send('Balade not found.');
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error updating : ' + err.message);
    }
});

// Delete balade
router.get("/delete/:id",isAuthenticated, isValidId("Suppression"), availableBalade("Suppression"), async function(req, res) {
    try {
        const { id } = req.params;
        const balade = await Balade.findOne({_id : id});
        if (!balade) {
            return res.status(404).send("Balade not found");
        }
        await Balade.deleteOne(balade);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Erreur du serveur");
    }
});

export default router;