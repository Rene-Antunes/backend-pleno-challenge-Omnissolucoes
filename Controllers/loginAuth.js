const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')


const secret = 'jwt-secret-key'

// Used to log into the system and generate token
exports.loginHandler = async (req, res) => {
  const { user_identity, password } = req.body

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: user_identity }, { username: user_identity }],
      },
    })

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid email/username or password'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid email/username or password'})
    }

    const token = jwt.sign(
      { id: user.id, username: user.username},
      secret,
      {
        expiresIn: '1d',
      }
    )
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error',
    })
  }
}
