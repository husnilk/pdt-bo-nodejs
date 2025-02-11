const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: "false",
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: "false",
        message: "User not found",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: "false",
        message: "Invalid combination user and password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: "true",
      message: "User logged in successfully",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: "Internal Server Error",
    });
  }
};

module.exports = { login };
