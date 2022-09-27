import { db } from '../database/db.js';

export default (req, res, next) => {
    try {
        const findObjectives = 'SELECT id FROM users WHERE id = ?';
        if (req.body.ids.length > 1) {
            for (let i = 0; i < req.body.ids.length - 1; i++) {
                findObjectives = findObjectives + ' OR id = ?';
            }
        }

        db.query(findObjectives, [...req.body.ids.length], (err, data) => {
            try {
                if (data.length !== req.body.ids.length) {
                    return res.json({ message: 'access denied', isAuthorized: false });
                } else {
                    next();
                }
            } catch (error) {
                return res.json({ message: 'access denied', isAuthorized: false, error });
            }
        });
    } catch (error) {
        return res.json({ message: 'access denied', isAuthorized: false, error });
    }
};
