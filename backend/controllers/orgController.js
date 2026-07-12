const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/org/departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });
    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve departments.",
      error: error.message
    });
  }
};

// POST /api/org/departments
exports.createDepartment = async (req, res) => {
  try {
    const { name, parent_id, head_id } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required."
      });
    }

    const trimmedName = name.trim();

    // 2. Prevent duplicate department names (case-insensitive)
    const existingDept = await prisma.department.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive'
        }
      }
    });

    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: "A department with this name already exists."
      });
    }

    // 3. Create the department
    const newDept = await prisma.department.create({
      data: {
        name: trimmedName,
        parent_id: parent_id || null,
        head_id: head_id || null
      }
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: newDept
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create department.",
      error: error.message
    });
  }
};

// GET /api/org/asset-categories
exports.getAssetCategories = async (req, res) => {
  try {
    const categories = await prisma.assetCategory.findMany({
      orderBy: { name: 'asc' }
    });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve asset categories.",
      error: error.message
    });
  }
};

// POST /api/org/asset-categories
exports.createAssetCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Asset category name is required."
      });
    }

    const trimmedName = name.trim();

    // 2. Prevent duplicate category names (case-insensitive)
    const existingCategory = await prisma.assetCategory.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive'
        }
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "An asset category with this name already exists."
      });
    }

    // 3. Create the category
    const newCategory = await prisma.assetCategory.create({
      data: {
        name: trimmedName,
        description: description || null
      }
    });

    res.status(201).json({
      success: true,
      message: "Asset category created successfully.",
      data: newCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create asset category.",
      error: error.message
    });
  }
};

// PATCH /api/org/users/:id/promote
exports.promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // 1. Validate UUID format
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format."
      });
    }

    // 2. Validate role field is sent
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required for promotion."
      });
    }

    // 3. Validate target role is either ASSET_MANAGER or DEPARTMENT_HEAD
    const validPromotionRoles = ['ASSET_MANAGER', 'DEPARTMENT_HEAD'];
    if (!validPromotionRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected. Users can only be promoted to ASSET_MANAGER or DEPARTMENT_HEAD."
      });
    }

    // 4. Retrieve user
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // 5. Do not modify ADMIN user roles
    if (user.role === 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: "Cannot modify the role of an Admin user."
      });
    }

    // 6. Perform update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department_id: true,
        created_at: true
      }
    });

    res.status(200).json({
      success: true,
      message: `User promoted to ${role} successfully.`,
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to promote user.",
      error: error.message
    });
  }
};

// GET /api/org/users (List all users formatted for frontend)
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        department: true
      },
      orderBy: { name: 'asc' }
    });

    const roleMapping = {
      'ADMIN': 'Admin',
      'EMPLOYEE': 'Employee',
      'ASSET_MANAGER': 'Asset Manager',
      'DEPARTMENT_HEAD': 'Department Head'
    };

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleMapping[user.role] || user.role,
      status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
      department: user.department ? user.department.name : 'None',
      created_at: user.created_at
    }));

    res.status(200).json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
      error: error.message
    });
  }
};
