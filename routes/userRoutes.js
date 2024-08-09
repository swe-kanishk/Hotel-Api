const express = require('express');
const router = express.Router();
const { register, login, logout, addToFavourites } = require('../controllers/userController'); // Adjust path as per your actual file structure

router.post('/register', (req, res) => {
    console.log(req)
});
router.post('/login', login);
router.post('/logout', logout);
router.post('favorites/add', addToFavourites);

module.exports = router;