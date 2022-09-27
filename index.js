import express from 'express';
import cors from 'cors';
import checkAuth from './utils/checkAuth.js';
import checkValidObjectvies from './utils/checkValidObjectvies.js';

import {
    loginUser,
    registerUser,
    blockUsers,
    unblockUsers,
    deleteUsers,
    getUsers,
} from './controllers/UserController.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/users', checkAuth, getUsers);

app.post('/users', registerUser);

app.post('/users/login', loginUser);

app.put('/users/block', [checkAuth, checkValidObjectvies], blockUsers);

app.put('/users/unblock', [checkAuth, checkValidObjectvies], unblockUsers);

app.delete('/users', [checkAuth, checkValidObjectvies], deleteUsers);

app.listen(process.env.PORT || 8800, () => {
    console.log('server is working properly');
});
