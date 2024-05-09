const { User } = require('../models')
const bcrypt = require('bcrypt')
const { Op, where } = require('sequelize')

// Register a user
exports.userRegister = async (req, res) => {
    const { username, password, confirmPassword, firstName, lastName, age, phoneNumber, email } = req.body
    
    const existingUser = await User.findOne({
      where: {
        [Op.and]: [{ email: email }],
      },
    })
    
    if(password !== confirmPassword){
      return res.status(401).json('Password not Match')
    }
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        message: 'Email already exists',
      })
    }
   
     
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
  
    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      email,
      phoneNumber
     })
  
    return res.json({
      ok: true,
      data: {
        username: newUser.username,
        name: newUser.name,
        firstName,
        lastName,
        age,
        email,
        phoneNumber
      },
    })
  }

  //Load a list of users
  exports.getUserList = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['password'],
        },
      })
      return res.json({
        ok: true,
        data: users,
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: 'Server error',
      })
    }
  }

  //Load a single user by id
 exports.GetUserById =  async (req, res) =>{
    try{
        const user = await User.findByPk(req.params.id,
        {
            attributes: {
                exclude: ['password'],
              },
        })

        if(!user){
          return res.status(404).json({
            ok: false,
            message: 'User not found'
          })
        }

        return res.json({
            ok:true,
            data: user
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            ok: false,
            message:'Serve error'
        })
    }
 }

// Update a user by id
exports.updateUser = async (req, res) => {
  
  const userId = req.params.id;
  const { 
          newUsername,
          newFirstName,
          newLastName,
          newEmail,
          newPhoneNumber,
          newAge
        } = req.body
  
  
  
  try {
    const updatedUser = await User.update(
      { username: newUsername,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phoneNumber: newPhoneNumber,
        age: newAge
      },
      { where: { id: userId } }
    )
    if (updatedUser[0] === 1) {
      return res.json(
        {
          ok: true,
          message: 'Update Changes:',
          data: {
            newUsername,
            newFirstName,
            newLastName,
            newEmail,
            newPhoneNumber,
            newAge
          }
        }
      )
      
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' })
  }

 
}

//Update user password by searching for email
exports.updatePassword = async(req, res) => {

  const {userEmail, userCurrentPassword, userNewPassowrd}  = req.body
  
  try{
    
    const user = await User.findOne({
      where: {
        [Op.and]: [{email: userEmail}]
      }
    })

    if(!user){
      return res.status(404).json({message: 'User email not found'})
    }

    const validatedPassword = await bcrypt.compare(userCurrentPassword, user.password)

    if(!validatedPassword){
      return res.status(401).json({message: 'Invalid current Password'})
    }

    if(userCurrentPassword === userNewPassowrd ){
      return res.status(401).json({message: 'Password cannot be equal'})
  
    }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userNewPassowrd, salt)
        
        const newPassword = await User.update(
            {password: hashedPassword},
            {where: {id: req.user.id}}
          );
      
      if (newPassword[0] === 1) {
        return res.json({ message: 'Password updated successfully',

          })
          
        }
      }catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
  }
}


//delete a user by id
exports.deleteUser = async (req, res) => {
  const { user_email } = req.body
 
  try {
    const deletedUser = await User.destroy({
       where: {email: user_email}
       
      
      })
    if (deletedUser) {
      res.status(204).json()
    } else {
      res.status(404).json({ message: 'User not found'})
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error'})
  }
}