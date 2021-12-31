const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require('../databse/connectionDB')
const user = require('../models/userSchema')

router.get('/', (req, res) => {
    res.send(`Hello world from the server router js`)
})

router.post('/register', async (req, res) => {
    const { email, phone, password, confirmpassword } = req.body

    const userPhoneExist = await user.findOne({ phone: phone });
    const userEmailExist = await user.findOne({ email: email });

    if (userEmailExist || userPhoneExist) {
        return res.status(422).send(`Email or phone already exist.`)
    }
    // else if (password != confirmpassword) {
    //     return res.status(422).send(`Password are not matching.`)
    // }

    try {
        const users = await new user(req.body);


        users.save().then(() => {
            res.status(201).send(`Your registration is Successfull.`);
        }).catch((e) => {
            res.status(400).send(`Failed to register. Please fill the details correctly.`);
        });
    }
    catch (error) {
        console.log(error)
    }

})

// Login Route
router.post('/signin', async (req, res) => {

    try {
        const { email, password } = req.body

        const userLogin = await user.findOne({ email: email })


        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            let token = await userLogin.generateAuthToken();
            console.log(token)
            res.cookie("jwttoken",token),{
                expire:new Date(Date.now() + 2589200000),
                httpOnly:true
            }

            if (isMatch) {
                res.status(200).send(`Login Successfull.`);
            } else {
                res.status(400).send(`Invalid Credientials. Failed to Login.`);
            }
        }
        else{
            res.status(400).send(`Invalid Credientials.`);

        }


    }
    catch (err) {
        console.log(err)
    }
})



module.exports = router