import Balade from "../models/Balade.js";
export function availableBalade(text) {
    return async function availableBalade(req, res, next) {
        const {id} = req.params;
        const balade = await Balade.findOne({_id : id});
        if (!balade) {
            return res.status(404).render("404.ejs", { error : `${text} impossible because this balade doesn't exist` });
        }
        next();
    }
}