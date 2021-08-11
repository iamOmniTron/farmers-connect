const Transaction = require("../models/transaction.model");
const Product = require("../models/product.model");


module.exports = {
  createTransaction: async (req, res, next) => {
    try {
      //items is an array of objects
      const {
        items,
        price
      } = req.body;
      if (!items) {
        throw "cannot order empty cart";
      }
      const userId = req.session.user._id;
      const order = new Transaction({
        buyer: userId,
        items
      });
      const isUpdated = await Product.updateMany({
        _id: {
          $in: items
        }
      }, {
        $set: {
          isBought: true,
          buyer: userId
        }
      });
      if (!isUpdated) {
        throw "connot process order at the moment,please try again..."
      }
      const isSaved = await order.save();
      if (!isSaved) {
        throw "cannot create order at the moment,please try again..."
      }
      res.send("order successful");
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getTransaction: async (req, res,next )=>{
    try {
      const id:req.params.id;
      const order = await Transactions.findById(id);
      if(!order){
        throw "invalid order"
      }
      res.send(order);
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getAllTrasnsactions: async (req,res,next)=>{
    try {
      const orders = await Transaction.find({}).populate(["items","buyer"]);
      if(!orders){
        throw "no order at the moment";
      }
      res.send(orders);
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getAllUserTransactions: async(req,res,next)=>{
    try {
      const userId = req.query.userId;
      if(!userId){
        throw "no orders available"
      }
      cojnst orders = await Transaction.find({buyer:userId});
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
