import bcrypt from 'bcryptjs';

const password = 'admin123'; // change as needed, hash in production
const hashedPassword = bcrypt.hashSync(password, 10);
console.log('Hashed Password:', hashedPassword);