const CART = require("../models/cart");

const {
    verifyToken,
    authorizeToken,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();


/* CREATE -> takes userId as id in schema(body)*/
router.post("/add", verifyToken, async (req,res) => {
    const newCart = new CART(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


/* UPDATE CART -> takes objectId as id parameter */ 
router.post("/update/:id", authorizeToken, async (req,res) => {
    try{
        const updatedCart = await CART.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            { new: true },
        );
        res.status(200).json(updatedCart)
    }
    catch(err){
        res.status(500).json(err);
    }
})


/* DELETE */
router.delete("/:id", authorizeToken, async (req,res) => {
    try {
        await CART.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been Deleted Succefully");
    }
    catch(err) {
        res.status(500).json(err);    
    };
});


/* GET USER CART -> takes ObjectId as id*/
router.get("/:id", authorizeToken, async (req,res) => {
    try{
        const cart_instance = await CART.findById(req.params.id);
        res.status(200).json(cart_instance);
    }
    catch(err){
        res.status(500).json(err);
    };
})


/* GET ALL USERS CART */
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
        const carts = await CART.find();
        res.status(200).json(carts);
    }
    catch(err){
        res.status(500).json(err);
    };
})



module.exports = router;
