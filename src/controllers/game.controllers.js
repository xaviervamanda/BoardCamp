import {db} from "../database/database.connection.js";

export async function listGames(req, res){
    try{
        const games = await db.query("SELECT * FROM games");
        return res.status(200).send(games.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function createGame(req, res){

}