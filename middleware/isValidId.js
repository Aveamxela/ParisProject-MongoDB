import { isValidObjectId } from "mongoose";


export function isValidId (text) {
    return async function isValidId(req, res, next) {
        const {id} = req.params;
        if(!isValidObjectId(id)){
            return res.status(400).render("400.ejs", { error : `${text} impossible because this id doesn't exist` });
        }
        next();
    }
}