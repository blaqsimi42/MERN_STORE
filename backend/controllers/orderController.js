import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import axios from "axios";
import asyncHandler from "../middlewares/asyncHandler.js";

// 🧮 Utility function to calculate prices
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.085;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// 🛒 Create a new order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const match = itemsFromDB.find(
        (p) => p._id.toString() === itemFromClient._id
      );

      if (!match) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: match.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📦 Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👤 Get orders for a specific user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔢 Count total & paid orders
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ isPaid: true });
    res.json({ totalOrders, paidOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 💰 Calculate total sales (only paid)
const calculateTotalSales = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
    ]);

    res.json({ totalSales: result[0]?.totalSales || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📅 Calculate paid sales by date
const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!salesByDate.length) {
      return res.status(200).json([{ _id: "No Data", totalSales: 0 }]);
    }

    res.status(200).json(salesByDate);
  } catch (error) {
    console.error("Error calculating total sales by date:", error.message);
    res.status(500).json({
      message: "Server error calculating total sales by date",
    });
  }
});

// 🔍 Find single order
const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 💳 Mark order as paid (Paystack verification)
const markOrderAsPaid = async (req, res) => {
  const { reference } = req.body;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data;

    if (!data.status || data.data.status !== "success") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findById(req.params.id).populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paidAmount = data.data.amount / 100;
    const paystackEmail = data.data.customer.email;

    if (paidAmount !== Number(order.totalPrice)) {
      return res.status(400).json({
        message: `Amount mismatch: expected ${order.totalPrice}, got ${paidAmount}`,
      });
    }

    if (paystackEmail !== order.user.email) {
      return res.status(400).json({
        message: "Email mismatch: transaction not linked to this user",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: data.data.id,
      status: data.data.status,
      reference: data.data.reference,
      amount: paidAmount,
      channel: data.data.channel,
      currency: data.data.currency,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Payment verified and order marked as paid",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error verifying Paystack transaction:", error.message);
    res.status(500).json({
      message: "Error verifying Paystack payment",
      error: error.message,
    });
  }
};

// 🚚 Mark order as delivered
const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isDelivered) {
    return res.status(200).json({
      message: "Order already marked as delivered",
      order,
    });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  res.status(200).json({
    message: "Order marked as delivered successfully",
    order: updatedOrder,
  });
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
