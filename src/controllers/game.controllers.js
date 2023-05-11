import {db} from "../database/database.connection.js";

export async function listGames(req, res){
    try{
        const games = await db.query("SELECT * FROM games")
        return res.status(200).send(games.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function createGame(req, res){
    const {name, image, stockTotal, pricePerDay} = req.body;

    try{
        const gameName = await db.query("SELECT * FROM games WHERE name = $1", [name]);
        if (gameName.rowCount !== 0){
            return res.status(409).send("Game already exists");
        }
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, 
        [name, image, stockTotal, pricePerDay]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}