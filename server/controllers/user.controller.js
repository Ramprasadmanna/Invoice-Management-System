import { prisma } from "#config/db.config.js";
import generateToken from "#utils/generate-token.utils.js";
import bcrypt from "bcryptjs";

/**
 * @desc		Login user
 * @route		POST /api/v1/users/login
 * @access	public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user.id);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    console.log(`[LOGIN] User: ${email}, IP: ${req.ip}`);
  } else {
    res.status(401);
    throw new Error("Invalid Email Or Password");
  }
};

/**
 * @desc		Create user
 * @route		POST /api/v1/users/
 * @access	private/admin
 */
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      isAdmin: true,
    },
  });

  res.status(200).json({
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
  });
};

/**
 * @desc		Logout user
 * @route		POST /api/v1/users/logout
 * @access	private
 */
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
};

/**
 * @desc		Update user profile
 * @route		PUT /api/v1/users/profile/:id
 * @access	private
 */
const updateUserProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let password = req.body.password;

  if (req.body.password) {
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    password = await hashPassword(req.body.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      password: password || user.password,
    },
  });

  generateToken(res, updatedUser.id);

  res.status(200).json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
};

/**
 * @desc		Get all users
 * @route		GET /api/v1/users
 * @access	private/admin
 */
const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.status(200).json(users);
};

/**
 * @desc		Delete User
 * @route		DELETE  /api/v1/users/:id
 * @access	private/admin
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  await prisma.user.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "User Deleted Sucessfully" });
};

export {
  loginUser,
  logoutUser,
  updateUserProfile,
  getUsers,
  createUser,
  deleteUser,
};
