const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname));


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', orderSchema);




app.post('/api/order', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ success: true, message: 'Order received!', order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save order.' });
    }
});


app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
});


app.delete('/api/orders', async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ success: true, message: 'All orders have been deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete all orders.' });
    }
});


app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Order deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete order.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});