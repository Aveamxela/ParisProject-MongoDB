import User from "../models/User.js";

export async function uniqueEmail(req, res, next) {
    const { email } = req.body;
    const response = await User.findOne({ email: email });
    if (response) {
        return res.status(400).render("users/register.ejs", { error: `Email ${email} already exists`});
    }
    next();
}
