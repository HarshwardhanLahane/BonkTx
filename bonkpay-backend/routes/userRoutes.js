const express = require("express");
const router = express.Router();
const { registerUser, loginUser, signAndSendEthTransaction,signAndSendSolTransaction, getPrivateKeys, ejectUser } = require("../controllers/userController");

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);


// Send ETH
router.post("/send-eth", signAndSendEthTransaction);

// Send SOL
router.post("/send-sol", signAndSendSolTransaction);

// Get private keys
router.post('/private-keys', getPrivateKeys); 

// Eject user
router.post("/eject", ejectUser);



module.exports = router;