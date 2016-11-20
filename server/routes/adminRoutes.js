const express = require('express'),
	path = require('path'),
	admin = express.Router();

admin.get('/dashboard', (req, res) => {
	console.log('dashboard');
	return res.sendFile(path.join(__dirname, '../../public/html/adminDashboard.html'));
});

admin.get('/add-product', (req, res) => {
    return res.sendFile(path.join(__dirname, '../../public/html/adminAddProduct.html'));
});

admin.get('/edit-products', (req, res) => {
    return res.sendFile(path.join(__dirname, '../../public/html/adminEditProducts.html'));
});

module.exports = admin;