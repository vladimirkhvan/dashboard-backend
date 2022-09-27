import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwt_key } from '../assets/jwt_key.js';

import { getFullDate } from '../utils/getFullDate.js';

import { hashPassword } from '../utils/hashPassword.js';
import { db } from '../database/db.js';

export const getUsers = (req, res) => {
    const q = 'SELECT * FROM users';
    db.query(q, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json({ users: data, isAuthorized: true });
    });
};

export const registerUser = async (req, res) => {
    try {
        const q =
            'INSERT INTO users (`username`, `password`, `email`, `createdAt`, `lastVisit`, `status`) VALUES (?)';

        const hashedPassword = await hashPassword(req.body.password);

        const values = [
            req.body.username,
            hashedPassword,
            req.body.email,
            getFullDate(),
            getFullDate(),
            'active',
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(409).json(err);
            }

            return res.json({ message: 'User was added successfully' });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server is unable to proceed data' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const q = 'SELECT id, username, password, status FROM heroku_bc558aeaefc8cb6.users WHERE email=?';
        const email = req.body.email;
        const password = req.body.password;

        db.query(q, [email], async (err, data) => {
            if (err || data.length < 1) {
                return res.json({ success: false, err });
            }

            const isValid =
                (await bcrypt.compare(password, data[0].password)) && data[0].status === 'active';

            const id = data[0].id;
            const username = data[0].username;

            if (isValid) {
                let q = 'UPDATE heroku_bc558aeaefc8cb6.users SET lastVisit=? WHERE id = ?';

                db.query(q, [getFullDate(), id], (err, data) => {
                    if (err) {
                        return res.json({ success: false, err });;
                    }
                });

                const token = jwt.sign(
                    {
                        id: id,
                    },
                    jwt_key,
                    { expiresIn: '30d' },
                );

                return res.json({ success: true, token, id, username });
            } else {
                return res.json({ success: false, err });
            }
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
};

export const blockUsers = (req, res) => {
    let q = 'UPDATE heroku_bc558aeaefc8cb6.users SET status="blocked" WHERE id = ?';

    if (req.body.ids.length > 1) {
        for (let i = 0; i < req.body.ids.length - 1; i++) {
            q = q + ' OR id = ?';
        }
    }

    db.query(q, [...req.body.ids], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (req.body.ids.includes(req.userId)) {
            return res.json({ success: true, isAuthorized: false });
        }
        return res.json({ success: true, isAuthorized: true });
    });
};

export const unblockUsers = (req, res) => {
    let q = 'UPDATE heroku_bc558aeaefc8cb6.users SET status="active" WHERE id = ?';

    if (req.body.ids.length > 1) {
        for (let i = 0; i < req.body.ids.length - 1; i++) {
            q = q + ' OR id = ?';
        }
    }

    db.query(q, [...req.body.ids], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json({ success: true, isAuthorized: true });
    });
};

export const deleteUsers = (req, res) => {
    let q = 'DELETE FROM users WHERE id = ?';

    if (req.body.ids.length > 1) {
        for (let i = 0; i < req.body.ids.length - 1; i++) {
            q = q + ' OR id = ?';
        }
    }

    db.query(q, [...req.body.ids], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (req.body.ids.includes(req.userId)) {
            return res.json({ success: true, isAuthorized: false });
        }
        return res.json({ success: true, isAuthorized: true });
    });
};
