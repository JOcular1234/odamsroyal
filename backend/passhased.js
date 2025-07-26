const bcrypt = require('bcryptjs');

const password = 'Odamz25@'

const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
