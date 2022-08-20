const PRODUCT = require("../models/products");

const {
    verifyToken,
    authorizeToken,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();


/* CREATE */
router.post("/create", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new PRODUCT(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch(err) {
        res.status(500).json(err);    
    }
})


/* UPDATE */
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const updatedProduct = await PRODUCT.findByIdAndUpdate(
            req.params.id,
            {
                $set : req.body,
            },
                {new:true}
            );
        res.status(200).json(updatedProduct);
    }
    catch(err) {
        res.status(500).json(err);
    };
})


/* DELETE METHOD */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await PRODUCT.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted Product Successfully");    
    }
    catch (err) {
        res.status(500).json(err);
    }
})


/* GET PRODUCTS */
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const PRODUCT_instance = await PRODUCT.findById(req.params.id);
        res.status(200).json(PRODUCT_instance);     
    }
    catch (err) {
        res.status(500).json(err);
    };
});

/* GET ALL PRODUCTS */
router.get("/all", async (req,res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qPrice = req.query.price;
    try {
        let product;
        if(qNew){
            product = await PRODUCT.find().sort({createdAt:-1});
        }
        else if(qCategory){
            product = await PRODUCT.find(
                {
                    categories:{
                        $in : [qCategory],
                    },
                });
        }
        else if(qPrice){
            product = await PRODUCT.find().sort({ price:-1 });
        }
        else{
            product = await PRODUCT.find();
        }
        res.status(200).json(product);
    }
    catch (err){
        res.status(500).json(err);    
    };
});




module.exports = router;

/* 
{
    "title" : "nike shoes",
    "desc" : "nike shoes for men in a very attractive color to add beauty to your's personality",
    "img" : "null",
    "categories" : ["shoes", "men"],
    "color" : "pink",
    "size" : "medium",
    "price" : 120
}
*/
