import {db} from "../database/database.connection.js";

export async function listRentals(req, res) {
    try{
        // inserir o customer e o game de cada aluguel na lista de aluguéis.
        const rentals = await db.query(`SELECT 
            "customerId", "gameId", "daysRented", to_char("rentDate", 'YYYY-MM-DD') as "rentDate", "originalPrice", "returnDate", "delayFee" 
            FROM rentals;`);
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
        const rentalPrice = existsGame.rows[0].pricePerDay * daysRented;

        // validar que existem jogos disponíveis, ou seja, 
        // que não tem alugueis em aberto acima da quantidade de jogos em estoque.

        await db.query(`INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
            VALUES ($1, $2, $3, $4, ${rentalPrice}, null, null);`,
            [customerId, gameId, daysRented, date]);
        return res.sendStatus(201);
    } catch (err){
        return res.status(500).send(err.message);
    }
}