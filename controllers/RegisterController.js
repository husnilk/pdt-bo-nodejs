const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../prisma/client");

const register = async (req, res) => {
  console.log("Test");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: "false",
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await db.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      success: "true",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: "false", message: "Internal Server Error" });
  }
};

module.exports = { register };
