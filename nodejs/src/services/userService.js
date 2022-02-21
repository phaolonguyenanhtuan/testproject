import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt=bcrypt.genSaltSync(10);

let hasUserPassword = (password) => {
    return new Promise(async (resolve,reject) => {
        try{
        let hashPassword= await bcrypt.hashSync(password,salt);
        resolve(hashPassword);

        }catch(e){
            reject(e);

        }
    })
}



let handleUserLogin = (email,password) => {
    return new Promise(async (resolve,reject) => {
        try{
            let userData = {};
            let isExistEmail = await checkUserEmail(email);
            if(isExistEmail){
                // user email already exist
                let user = await db.User.findOne({
                    attributes : ['id','email','roleId','password','firstName','lastName'],
                    where : {email:email},
                    raw : true, // return a variable type object
                    // attributes : {
                    //     include : ['email','roleId'], // define columns that you want to show
                         //exclude : [] // define columns that you don't want
                    // }
                })

                if(user) {
                    // compare password    
                let check = await bcrypt.compareSync(password,user.password);
               // let check = true;
                 if(check) {
                     userData.errCode = 0 ;
                     userData.errMessage = 'ok';
                     delete user.password;
                     userData.user = user;
                 } 
                 else {
                     userData.errCode = 3;
                     userData.errMessage = 'wrong password';
                 }            

                }
                else {
                    userData.errCode = 2,
                    userData.errMessage = `User is not found`;
                }                
                //resolve(userData);
            }
            else {
                userData.errCode = 1;
                userData.errMessage="Email is not exist.Please enter other email!";
               
            }
            resolve(userData);

        }catch(e) {
            reject(e);
        }
    })
}

//let compareUserPassword = () => {
 //   return new Promise((resolve,reject) => {
    //    try{

   //     }catch(e){
       //     reject(e);
//}
//})

//}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve,reject) => {
        try{
            let user = await db.User.findOne({
                where:{email:userEmail},
            })
            if(user){
                resolve(true);
            }
            else {
                resolve(false);
            }

        }catch(e){
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve,reject) => {
        try{
            let users = '';
            if(userId === 'ALL') {
                users = await db.User.findAll({
                attributes: {
                      exclude: ['password']
                   }  

                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where : { id:userId },
                    attributes:{
                        exclude: ['password']
                    }
                })
            }            
            resolve(users);

        }catch(e){
            reject(e);
        }

    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve,reject) => {
        try{
            //check email is exist
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode : 1,
                    errMessage : 'Your Email is already !!,please Choose another Email!',
                })
            }
            else {
                let hasPasswordFromBcrypt= await hasUserPassword(data.password);
            await db.User.create({
                //email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password:hasPasswordFromBcrypt,
                email: data.email,
                address:data.address,
                phoneNumber:data.phoneNumber,
                gender:data.gender,               
                roleId:data.roleId,
                positionId : data.positionId,
                image : data.avatar             
            })
            resolve({
                errCode: 0,
                message: 'Ok',
            })
            }
            
        }catch(e){
            reject(e);

        }
    })
} 

let deleteUser = (userId) => {
    return new Promise(async(resolve,reject) => {
       let user = await db.User.findOne({
           where : {id : userId}
       }) 
       if(!user) {
           resolve({
               errCode : 2,
               errMessage : 'The User is not exist !',
           })
       }
       await db.User.destroy({
           where : {id : userId}
       });
       resolve({
           errCode : 0,
           message : 'The User was deleted !'
       })
    })    
}

let updateUserData = (data) => {
    return new Promise(async(resolve,reject) => {
        try{
            if(!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode : 2,
                    errMessage : 'Missing Parameters required',
                })
                
            }
            let user = await db.User.findOne({
                where:{id:data.id},
                raw :false,
            })
            if(user){  
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roldeId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if(data.avatar) {
                    user.image =data.avatar;

                }
                
                
                await user.save();
                
                // await db.User.save({
                //     firstName : data.firstname,
                //     lastName : data.lastname,
                //     address : data.address,
                // });
                resolve({
                    errCode : 0,
                    message : 'Update the User is success',
                })
                } else {
                resolve({
                    errCode : 1,
                    errMessage :'User not Found !!',
                });
            }

        }catch(e){
            reject(e);
        } 
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve,reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode : 1,
                    errMessage : 'Missing required parameter !'
                })

            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where : {type : typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);


            }
           
            
        }catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin:handleUserLogin,
    getAllUsers:getAllUsers,
    createNewUser:createNewUser,
    deleteUser : deleteUser,
    updateUserData:updateUserData,
    getAllCodeService :getAllCodeService

}