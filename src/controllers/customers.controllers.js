import {db} from "../database/database.connection.js";

export async function addCustomer(req, res) {
    const {name, phone, cpf, birthday} = req.body;

    try{
        const customerCpf = await db.query("SELECT * FROM customers WHERE cpf = $1", [cpf]);
        if (customerCpf.rowCount !== 0){
            return res.status(409).send("CPF already registered");
        }
        await db.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
         [name, phone, cpf, birthday]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function listCustomers(req, res){
    try{
        const customers = await db.query("SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers;"
        );
        return res.status(200).send(customers.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res){
    const {id} = req.params;
    try{
        const customer = await db.query("SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers WHERE id = $1;", [id]);
        if (customer.rowCount === 0){
            return res.status(404).send("Customer not found");
        }
        return res.status(200).send(customer.rows[0]);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}
