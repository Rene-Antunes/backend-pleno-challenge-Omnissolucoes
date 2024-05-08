
const request = require('supertest')
const app = require('../app.js')
const bcrypt = require("bcrypt")
const { User } = require("../models")
const { Op, where } = require('sequelize')


const populatingUsers = async () =>{
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync("1234", salt)
  
await User.bulkCreate([
  {
    
    username: "rene",
    password:hashedPassword,
    confirmPassword: hashedPassword,
    email: "reneantunes3@gmail.com",
    firstName: "rene",
    lastName: "Antunes",
    phoneNumber:"+552199999"
  },
  { 
    username: "Helena",
    password:hashedPassword,
    confirmPassword: hashedPassword,
    email: "Helena@gmail.com",
    firstName: "Helena",
    lastName: "Antunes",
    phoneNumber:"+552199999"
  },
  {
    username: "rafa",
    password:hashedPassword,
    confirmPassword: hashedPassword,
    email: "rafa3@gmail.com",
    firstName: "rafa",
    lastName: "Antunes",
    phoneNumber:"+552199999"
  }
]);
}
const clearDataBase = async () => {
  await User.destroy({
    where: {
      id:{
        [Op.ne]: 1
      }
    }
  });
}

const rollbackUserPassword = async () => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync("1234", salt)
  await User.update(
    
    {
      password: hashedPassword
    },
    {where: {id: 1}}
  )

}

const rollbackUsername = async () =>{
  
  await User.update(
    {
      username: 'rene'
    },
    {where: {id: 1}}
  )
}

describe('Testing users endpoint', () => {
    let token
    
    beforeEach(async () => {
      populatingUsers()
      rollbackUsername()
      
    })

    afterAll(async () => {
      clearDataBase()
      rollbackUserPassword()
      
      
    })

    it('It should register a user by accessing the "/register" endpoint"', async () =>{
      const userData = {
        username: "rene",
        password:"1234",
        confirmPassword: "1234",
        email: "reneantunes4@gmail.com",
        firstName: "rene",
        lastName: "Antunes",
        phoneNumber:"+552199999"
      }
      
      const response = await request(app)
            .post('/register')
            .send(userData)
            .expect(200)

            expect(response.ok).toEqual(true)
            expect(response.body.data.username).toBeDefined()
            expect(response.body.data.email).toBeDefined()
            expect(response.body.data.firstName).toBeDefined()
            expect(response.body.data.lastName).toBeDefined()
            expect(response.body.data.phoneNumber).toBeDefined() 
      
    })

    it('It is possible to sigin into the application through the "/login" endpoint', async () => {
      
      const loginData = {
        user_identity: "reneantunes3@gmail.com",
        password:"1234"
      }

      const response = await request(app)
      .post('/login')
      .send(loginData)
      .expect(200)

      expect(response.body.user.id).toBeDefined()
      expect(response.body.user.username).toBeDefined()
      expect(response.body.user.email).toBeDefined()
      expect(response.body.token).toBeDefined()
      
      token = response.body.token
      console.log('Token obtained:', token)
    })
    
  
    it('It should return a list of users data when accessing the users endpoint', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`).expect(200)
  
        console.log('Response:', response.body)
        
        
        expect(response.body.data.length).toBeTruthy;
      
    })

    it('It should return a single user according to the id provided using endpoint "/user/:id" ', async ()=> {
      const userId = 1 
      const response = await request(app)
          .get(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

          expect(response.body.data.id).toBeDefined()
          expect(response.body.data.username).toBeDefined()
          expect(response.body.data.email).toBeDefined()
          expect(response.body.data.firstName).toBeDefined()
          expect(response.body.data.lastName).toBeDefined()
          expect(response.body.data.phoneNumber).toBeDefined()    
    })

    it('It should update user password based on the e-mail in the "/update-password" endpoint', async () =>{
     
      const newUserPassword = {
        userEmail: "reneantunes3@gmail.com",
        userCurrentPassword:"1234",
        userNewPassowrd: "12345"
      }
      
      await request(app)
            .put('/update-password')
            .send(newUserPassword)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })

    it('It should update user based on the id in the endpoint "/users/:id" endpoint', async () =>{
      const userId = 1
      const newUserData = {
        newUsername: "rene atunes",
        newPhoneNumber: "+552199999",
      }


      const response = await request(app)
            .put(`/update-user/${userId}`)
            .send(newUserData)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

          expect(response.body.ok).toEqual(true)
          expect(response.body.message).toEqual("Update Changes:")
          expect(response.body.data.newUsername).toEqual("rene atunes")
            
    })

    it('It is possible to delete a specific user with id using endpoint', async () => {
      const userEmail =
      {
        user_email:'rafa3@gmail.com'
      } 
      await request(app)
            .delete('/delete')
            .send(userEmail)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
            
    })
    
    it('It should return error "401" when trying to login using the "/login" endpoint', async () =>{
      const loginData = {
        user_identity: "reneantunes3@gmail.com",
        password:"123457878"
      }

      await request(app)
      .post('/login')
      .send(loginData)
      .expect(401)
     
    })

    it('It should return error "401" when entering unequal passwords when accessing "/register" endpoint', async () =>{
      const userData = {
        username: "rene",
        password:"1234",
        confirmPassword: "1234345345",
        email: "@gmail.com",
        firstName: "rene",
        lastName: "Antunes",
        phoneNumber:"+552199999"
      }
      
      await request(app)
            .post('/register')
            .send(userData)
            .expect(401)
      })


       it('It should return error "400" when entering an existing email when accessing "/register" endpoint', async () =>{
      const userData = {
        username: "rene",
        password:"1234",
        confirmPassword: "1234",
        email: "reneantunes3@gmail.com",
        firstName: "rene",
        lastName: "Antunes",
        phoneNumber:"+552199999"
      }
      
      await request(app)
            .post('/register')
            .send(userData)
            .expect(400)
      })

      it('It should return error "404" when trying to access the list of users with an invalid resource', async () => {
        const response = await request(app)
          .get('/userss')
          .set('Authorization', `Bearer ${token}`)
          .expect(404)
          
          expect(response.ok).toEqual(false)
      })

      it('It should return error "404" when trying to access a single users with an invalid id" ', async ()=> {
        const userId = 6 
        const response = await request(app)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
  
            expect(response.body.ok).toEqual(false)
            expect(response.body.message).toEqual('User not found')
               
      })


      it('It should return error "401" when trying to access and change the password when the password does not match the current password', async () =>{
     
        const newUserPassword = {
          userEmail: "reneantunes3@gmail.com",
          userCurrentPassword:"12342345434",
          userNewPassowrd: "12345"
        }
        
       const response = await request(app)
              .put('/update-password')
              .send(newUserPassword)
              .set('Authorization', `Bearer ${token}`)
              .expect(401)

              expect(response.body.message).toEqual('Invalid current Password')

      })


      it('It should return error "404" when trying to access and change the password when the email is not found', async () =>{
     
        const newUserPassword = {
          userEmail: "@gmail.com",
          userCurrentPassword:"1234",
          userNewPassowrd: "12345"
        }
        
       const response = await request(app)
              .put('/update-password')
              .send(newUserPassword)
              .set('Authorization', `Bearer ${token}`)
              .expect(404)

              expect(response.body.message).toEqual('User email not found')

      })

      
  /*
    it('Deve retornar um erro 401 ao acessar o endpoint sem um token válido', async () => {
      const response = await request(app)
        .get('/users') // Substitua '/auth/user' pela rota real do seu aplicativo para acessar os dados do usuário
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
  
      console.log('Resposta de erro:', response.body)
      // Verifica se a resposta contém a mensagem de erro correta
      //expect(response.body.message).toEqual('Unauthorized');
    })
    */
  })

