// // frontend/src/pages/api/admin/created.js
// import { dbConnect } from '../../../utils/db';
// import Admin from '../../../models/Admin';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();
//   await dbConnect();
//   const { username, password } = req.body;
//   const exists = await Admin.findOne({ username });
//   if (exists) return res.status(400).json({ message: 'Admin exists' });
//   await Admin.create({ username, password });
//   res.status(201).json({ message: 'Admin created' });
// }
