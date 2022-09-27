import jwt from 'jsonwebtoken';

import { jwt_key } from '../assets/jwt_key.js';

import { db } from '../database/db.js';

export default (req, res, next) => {
    console.log('hi');
    console.log(req.headers.authorization);

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    try {
        const decodedInfo = jwt.decode(token, jwt_key);
        req.userId = decodedInfo.id;

        const q = 'SELECT id FROM heroku_bc558aeaefc8cb6.users WHERE id = ? AND status = "active"';

        db.query(q, [decodedInfo.id], (err, data) => {
            if (data.length < 1 || err) {
                return res.json({ message: 'access denied', isAuthorized: false });
            }
        });
        next();
    } catch (error) {
        return res.json({ message: 'access denied', isAuthorized: false, error });
    }
};
