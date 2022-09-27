import jwt from 'jsonwebtoken';

import { jwt_key } from '../assets/jwt_key.js';

import { db } from '../database/db.js';

export default (req, res, next) => {

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    try {
        const decodedInfo = jwt.decode(token, jwt_key);
        req.userId = decodedInfo.id;

        const q = 'SELECT id FROM  users WHERE id = ? AND status = "active"';

        db.query(q, [decodedInfo.id], (err, data) => {
            try {
                if (data.length < 1 || err) {
                    return res.json({ message: 'access denied', isAuthorized: false });
                }
            } catch (error) {
                return res.json({ message: 'access denied', isAuthorized: false, error });
            }
        });
        next();
    } catch (error) {
        return res.json({ message: 'access denied', isAuthorized: false, error });
    }
};
