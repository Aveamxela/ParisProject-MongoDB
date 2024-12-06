import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { uniqueEmail } from '../middleware/uniqueEmail.js';

const router = Router();

//Create user
router.get("/register", function(req,res){
    res.render("users/register.ejs", { error : ""});
})
router.post('/register', uniqueEmail, async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(req.body);
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashPassword });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).render("users/register.ejs", {error: 'Error registering user: ' + err.message});
    }
});

//Login User
router.get("/login", function(req,res){
    res.render("users/login.ejs", { error : ""});
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        //normalement mettre la même erreur que ce soit erreur d'email ou de password car sinon on donne trop d'indices
        const user = await User.findOne({ email });
        if (!user) return res.status(404).render("users/login.ejs", { error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).render("users/login.ejs", { error: "Invalid password" });
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Erreur connexion : ' + err.message);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
});


export default router;
