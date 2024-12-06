import express from "express"
import session from "express-session"
import baladesRouter from "./router/baladesRouter.js"
import usersRouter from "./router/usersRouter.js"
import mongoose from 'mongoose';

import { dirname , join } from "path"
import { fileURLToPath } from "url"

const app = express()
const PORT = 1236;
app.use(session({
    name: "paris",
    secret : "s3cr3t",
    resave : true,
    saveUninitialized : true,

}))

app.use(express.urlencoded({ extended: false }))

//mongoose 
const DB_URI = "mongodb+srv://admin:MBbzuPyLAWsq18uy@cluster0.wpoyh.mongodb.net/Paris";
mongoose.connect(DB_URI)
    .then(() => {
        console.log("Connexion à MongoDB réussie !");
    })
    .catch((err) => {
        console.error("Erreur de connexion à MongoDB :", err);
    });

//pour les fichiers .css 
const path_dossier = dirname(fileURLToPath(import.meta.url))
app.use(express.static(join(path_dossier, "public")))

//Si user connecté
app.use((req, res, next) => {
    res.locals.userIsAuthenticated = req.session && req.session.userId;
    next();
});

// moteur de template 
app.set('view engine', 'ejs')
app.set('views', './views')

app.use(baladesRouter)
app.use(usersRouter)

app.listen(PORT, console.log(`Le serveur écoute sur le port ${PORT}`))
