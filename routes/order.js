const ORDER = require("../models/order");

const {
    verifyToken,
    authorizeToken,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();


/* CREATE/MAKE ORDER -> takes userId as id in schema(body)*/
router.post("/add", verifyToken, async (req,res) => {
    const newOrder = new ORDER(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


/* UPDATE ORDER -> takes objectId as id parameter */ 
router.post("/update/:id", authorizeToken, async (req,res) => {
    try{
        const updatedOrder = await ORDER.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            { new: true },
        );
        res.status(200).json(updatedOrder)
    }
    catch(err){
        res.status(500).json(err);
    }
})


/* DELETE ORDERS*/
router.delete("/:id", authorizeToken, async (req,res) => {
    try {
        await ORDER.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been removed Succefully");
    }
    catch(err) {
        res.status(500).json(err);    
    };
});


/* GET USER ORDERS -> tkes userId as id*/
router.get("/:id", authorizeToken, async (req,res) => {
    try{
        const order_instance = await ORDER.findById(req.params.id);
        res.status(200).json(order_instance);
    }
    catch(err){
        res.status(500).json(err);
    };
})


/* GET ALL USERS ORDERS */
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
        const orders = await ORDER.find();
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    };
})



module.exports = router;
