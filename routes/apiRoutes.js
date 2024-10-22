const express = require("express");

const router = express.Router();

const Transaction = require("../model/transactions");
const Category = require("../model/category");

// POST /transactions - Add new transaction
router.post("/transactions", async (req, res) => {
  try {
    const { type, category, amount, description } = req.body;
    const transaction = new Transaction({
      type,
      category,
      amount,
      description,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /transactions - Retrieve all transactions
router.get("/transactions", async (request, response) => {
  try {
    const transactions = await Transaction.find().populate("category");
    response.status(200).json(transactions);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET /transactions/:id - Retrieve transaction by ID
router.get("/transactions/:id", async (request, response) => {
  try {
    const transaction = await Transaction.findById(request.params.id).populate(
      "category"
    );
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    response.status(200).json(transaction);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// PUT /transactions/:id - Update transaction by ID
router.put("/transactions/:id", async (request, response) => {
  try {
    const { type, category, amount, description } = request.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      request.params.id,
      { type, category, amount, description },
      { new: true }
    );
    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    response.status(200).json(updatedTransaction);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// DELETE /transactions/:id - Delete transaction by ID
router.delete("/transactions/:id", async (request, response) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      request.params.id
    );
    if (!deletedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    response.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// GET /summary - Retrieve summary of income and expenses
router.get("/summary", async (request, response) => {
  try {
    const income = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expense = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const balance = (income[0]?.total || 0) - (expense[0]?.total || 0);
    response.status(200).json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0,
      balance,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
