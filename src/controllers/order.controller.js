const { pool } = require('../config/db');

const orderController = {
  createOrder: async (req, res) => {
    const client = await pool.connect(); // Usamos el cliente directamente para la transacción
    try {
      const { 
        client_id, customer_name, customer_phone, total, 
        payment_method, items, seller_id 
      } = req.body;

      await client.query('BEGIN'); // Iniciamos transacción

      // 1. Insertar la Orden
      const orderRes = await client.query(
        `INSERT INTO orders (client_id, customer_name, customer_phone, total, payment_method, seller_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [client_id, customer_name, customer_phone, total, payment_method, seller_id]
      );
      const orderId = orderRes.rows[0].id;

      // 2. Insertar Items y descontar Stock
      for (let item of items) {
        // Insertar item
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, name) 
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.product_id, item.quantity, item.price, item.name]
        );

        // Descontar stock
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      await client.query('COMMIT'); // Guardamos cambios
      res.status(201).json({ message: 'Pedido creado con éxito', orderId });
    } catch (error) {
      await client.query('ROLLBACK'); // Si algo falla, deshacemos todo
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }
};

module.exports = orderController;