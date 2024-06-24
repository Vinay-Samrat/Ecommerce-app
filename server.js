const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'public', 'ecommerce-db.json');

app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req, res) => {
    const newUser = req.body;
    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        newUser.id = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;
        db.users.push(newUser);
        fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to database file' });
            }
            console.log('New user registered:', newUser);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        });
    });
});

app.get('/users', (req, res) => {
    const { email, password } = req.query;
    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        const user = db.users.find(user => user.email === email && user.password === password);
        if (user) {
            res.status(200).json([user]);
        } else {
            res.status(404).json({ message: 'Invalid login credentials' });
        }
    });
});

app.get('/orders', (req, res) => {
    const { userid } = req.query;
    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        const parsedUserId = parseInt(userid, 10);

        const orders = db.orders.filter(order => order.userId === parsedUserId);
        const products = db.products;

        // Attach product details to each order
        orders.forEach(order => {
            order.product = products.find(product => product.id === order.productId);
        });

        res.status(200).json(orders);
    });
});

app.get('/products', (req, res) => {
    const { productName_like } = req.query;
    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        let filteredProducts = db.products;
        if (productName_like) {
            filteredProducts = filteredProducts.filter(product =>
                product.productName.toLowerCase().includes(productName_like.toLowerCase())
            );
        }
        res.status(200).json(filteredProducts);
    });
});


// Add this route to fetch brands
app.get('/brands', (req, res) => {
    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        res.status(200).json(db.brands);
    });
});

// Add this route to fetch categories
app.get('/categories', (req, res) => {
    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        res.status(200).json(db.categories);
    });
});

app.post('/orders', (req, res) => {
    const newOrder = req.body;

    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }

        const db = JSON.parse(data);
        newOrder.id = db.orders.length ? db.orders[db.orders.length - 1].id + 1 : 1;
        db.orders.push(newOrder);

        fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to database file' });
            }
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        });
    });
});


app.put('/orders/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);
    const updatedOrder = req.body;

    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        const orderIndex = db.orders.findIndex(order => order.id === orderId);

        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }

        db.orders[orderIndex] = { ...db.orders[orderIndex], ...updatedOrder };

        fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to database file' });
            }
            res.status(200).json({ message: 'Order updated successfully', order: db.orders[orderIndex] });
        });
    });
});

// Add this to your existing server code
app.delete('/orders/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);

    fs.readFile(DB_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database file' });
        }
        const db = JSON.parse(data);
        const orderIndex = db.orders.findIndex(order => order.id === orderId);

        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }

        db.orders.splice(orderIndex, 1);

        fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to database file' });
            }
            res.status(200).json({ message: 'Order deleted successfully' });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
