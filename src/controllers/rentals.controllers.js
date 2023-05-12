import {db} from "../database/database.connection.js";

export async function listRentals(req, res) {
    try{
        const rentals = await db.query(`
        SELECT rentals."id",rentals."customerId", rentals."gameId", 
        rentals."daysRented", to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDate",
        rentals."originalPrice", to_char(rentals."returnDate", 'YYYY-MM-DD') as "returnDate", rentals."delayFee", 
            JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer,
            JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id;`);
        return res.status(200).send(rentals.rows);

    } catch (err){
        return res.status(500).send(err.message);
    }
}

export async function createRental(req, res){
    const {customerId, gameId, daysRented} = req.body;

    const today = new Date();
    const date = today.toISOString().substring(0, 10);
    
    try{
        const existsCustomer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
        if (existsCustomer.rowCount === 0) return res.status(400).send("Customer not found");

        const existsGame = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        if (existsGame.rowCount === 0) return res.status(400).send("Game not found");
        const gameStock = existsGame.rows[0].stockTotal;

        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null;`, [gameId]);
        console.log(rentals.rowCount)
        if (gameStock - rentals.rowCount === 0) return res.status(400).send("This game doesn't have enough stock");

        const rentalPrice = existsGame.rows[0].pricePerDay * daysRented;
        await db.query(`INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
            VALUES ($1, $2, $3, $4, ${rentalPrice}, null, null);`,
            [customerId, gameId, daysRented, date]);
        return res.sendStatus(201);
    } catch (err){
        return res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const {id} = req.params;

    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE "id" = $1;`, [id]);
        if (rental.rowCount === 0) return res.status(404).send("Rental not found");
        if (rental.rows[0].returnDate === null) return res.status(400).send("Rental not returned yet, it can't be deleted");
        await db.query(`DELETE FROM rentals WHERE "id" = $1;`, [id]);
        return res.sendStatus(200);
    } catch (err){
        return res.status(500).send(err.message);
    }
}

export async function returnRental(req, res) {
    const {id} = req.params;
    
    const today = new Date();
    const date = today.toISOString().substring(0, 10);
    let delayFee = 0;

    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE "id" = $1;`, [id]);
        if (rental.rowCount === 0) return res.status(404).send("Rental not found");
        if (rental.rows[0].returnDate !== null) return res.status(400).send("Rental already returned");

        const rentDate = new Date(rental.rows[0].rentDate);
        const daysRented = rental.rows[0].daysRented;
        const returnDay = rentDate.setDate(rentDate.getDate() + daysRented);
        let delayDays = Math.abs(today.getTime() - returnDay.getTime()) / (1000 * 60 * 60 * 24);
        delayDays = Math.ceil(delayDays);
        if (delayDays < 0) {
            delayFee = 0;
        } else {
            delayFee = delayDays * (rental.rows[0].originalPrice / daysRented);
        }
        

        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE "id" = $3;`, [date, delayFee, id]);
        return res.sendStatus(200);
    } catch (err){
        return res.status(500).send(err.message);
    }
}