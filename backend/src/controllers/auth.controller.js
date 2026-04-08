const bcrypt = require('bcryptjs');

const prisma = require('../config/prisma');
const jwtUtils = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || 'BUYER';

    if (role === 'ADMIN_HEAD' || role === 'ADMIN_CO_HEAD') {
      return res.status(400).json({ message: 'Admin roles cannot self-register' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwtUtils.signToken({
      userId: user.id,
      role: user.role
    });

    return res.status(201).json({
      message: 'Registered successfully',
      token,
      user
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwtUtils.signToken({
      userId: user.id,
      role: user.role
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return res.status(200).json({
    user: req.user
  });
}

module.exports = {
  register,
  login,
  me
};
