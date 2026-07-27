import Department from "../models/Department.js";


// ===============================
// Create Department
// ===============================
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and Code are required",
      });
    }

    const exists = await Department.findOne({
      $or: [{ name }, { code }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Departments
// ===============================
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// @desc    Get Single Department
// @route   GET /api/departments/:id
// @access  Private
// ===============================
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      department,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// @desc    Update Department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
// ===============================
export const updateDepartment = async (req, res) => {
  try {
    const { name, code, description, status } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    department.name = name ?? department.name;
    department.code = code ?? department.code;
    department.description = description ?? department.description;

    if (typeof status === "boolean") {
      department.status = status;
    }

    await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// @desc    Delete Department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
// ===============================
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};