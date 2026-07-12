const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, department_id } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !department_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Name, email, password, and department_id are required."
      });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format."
      });
    }

    // Simple password strength check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    // 2. Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered."
      });
    }

    // 3. Hash the password using bcryptjs
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Validate that the supplied department_id is a valid UUID format and exists
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(department_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department selected."
      });
    }

    const deptExists = await prisma.department.findUnique({
      where: { id: department_id }
    });

    if (!deptExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid department selected."
      });
    }

    // 5. Create user using Prisma (always ROLE = EMPLOYEE and STATUS = ACTIVE)
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role: "EMPLOYEE",
        status: "ACTIVE",
        department_id: department_id
      }
    });

    // 6. Return clean success response without password_hash
    res.status(201).json({
      success: true,
      message: "User signed up successfully.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        department_id: newUser.department_id,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during signup.",
      error: error.message
    });
  }
};
