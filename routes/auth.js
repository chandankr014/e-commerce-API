const router = require("express").Router();
const user = require("../models/users");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


/* here we used async function because we don;t know how much time is 
    needed to save the user inputs into the database.
    async keeps callling until a value is returned
    and await makes it work -> as it waits for async function to return a value to it.
*/

//REGISTRATION CREDENTIALS
router.post("/register", async (req, res) => {
    const newuser = new user({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECURE
            ).toString(),
    });

    try{
        const savedUser = await newuser.save();
        res.status(201).json(savedUser);
    }
    catch (err){
        res.status(500).json(err);
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const user_instance = await user.findOne({ username : req.body.username });
        !user_instance && res.status(401).json("Wrong Login Credentials - [username]");
        const hashed_password = CryptoJS.AES.decrypt(
            user_instance.password, 
            process.env.PASSWORD_SECURE
            );
        const originalPassword = hashed_password.toString(CryptoJS.enc.Utf8);
        
        originalPassword !== req.body.password && 
        res.status(401).json("Wrong Login Credentials - [password]");

        const accessToken = jwt.sign({
            id : user_instance._id,
            isAdmin : user_instance.isAdmin,
            }, 
            process.env.SECRET_TOKEN,
            {expiresIn:"3d"}
        );

        const { password, ...others} = user_instance._doc;

        res.status(200).json({...others, accessToken});

    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
