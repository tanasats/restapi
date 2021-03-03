const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/',verify,(req,res) => {
    console.log(req.user); // this parameter added by verifyToken module
    res.json( {post: {title: 'my title',description: 'my description'}} );
});

module.exports = router;