const router = require('express').Router()
const verify = require('../verifyToken')

//this verifies using the token before any transaction is made. 
router.get('/', verify, (req, res) => {
    // res.json({
    //     posts: {
    //         title: 'my first post',
    //         description: 'dont access this data'
    //     }
    // })
    res.send(req.user) // this gets the user id
})
module.exports = router 