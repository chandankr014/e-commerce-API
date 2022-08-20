const router = require("express").Router();
const user = require("../models/users");
const { verifyToken,
        verifyTokenAndAdmin,
        authorizeToken,
    } = require("./verifyToken");



/* GET methdods */
router.get("/test", (req, res) => {
    /* res.send('<font size=14 color="red">user router is successfully done</font>'); */
    res.send("user test is successful");
});
router.get("/test1", (req, res) => {
    res.send('<font size=14 color="red">user router is successfully done</font>');
});
router.get("/customhtml", (req, res) =>{
    res.sendFile("myFiles/homepage.html", {root: "."});
});



/* POST methods */
router.post("/credentials", (req, res) => {
    const username = req.body.username;
    res.send("your username is: " + username);
});



/* UPDATE METHOD */
router.put("/:id", authorizeToken, async (req, res) => {
    if (req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECURE
        ).toString(CryptoJS.enc.Utf8);
    }
    try {
        const updatedUser  = await user.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new : true}
        );
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


/* DELETE METHOD */
router.delete("/:id", authorizeToken, async (req, res) => {
    try {
        await user.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted user successfully");    
    }
    catch (err) {
        res.status(500).json(err);
    }
})


/* GET USERS */
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user_instance = await user.findById(req.params.id);
        const {password, ...others} = user_instance._doc;
        res.status(200).json(others);     
    }
    catch (err) {
        res.status(500).json(err);
    };
});

/* GET ALL USERS */
router.get("/allusers", verifyTokenAndAdmin, async (req,res) => {
    try {
        const all_users = await user.find();
        res.status(200).json(all_users);
    }
    catch (err){
        res.status(500).json(err);    
    }
})

/* GET LATEST USERS */
router.get("/latestusers", verifyTokenAndAdmin, async (req,res) => {
    try {
        const query = req.query.new;
        const n = req.query.n;
        const all_users = query 
            ? await user.find().sort({_id: 'desc'}).limit(n)
            : await user.find();

        res.status(200).json(all_users);
    }
    catch (err){
        res.status(500).json(err);    
    }
})



module.exports = router;

/* 
Bearer distinguish the type of authentication we are using
Bearer token doesnt provid internal security mechanism,
so it can be easily copied and stolen.
but OAuth-2.0 provide such scheme, therefore it is hard to implement but more secure.

NOTES:-
user and user_instance are two different things,
so we need to provide them different name as a variable.
*/