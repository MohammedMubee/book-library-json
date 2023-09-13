const express =require('express')


const router = express.Router();

const usersRouter =require( './user.router');
const bookRouter = require( './book.router');

router.use('/user',usersRouter)
router.use('/book',bookRouter)

module . exports = router;