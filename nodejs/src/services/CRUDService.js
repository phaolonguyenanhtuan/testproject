import bcrypt from 'bcryptjs';
import { use } from 'express/lib/application';
import db from '../models/index';
const salt=bcrypt.genSaltSync(10);


let CreateNewUser = async (data) => {
    return new Promise(async(resolve,reject) => {
        try{
            let hasPasswordFromBcrypt= await hasUserPassword(data.password);
            await db.User.create({
                firstName: data.firstname,
                lastName: data.lastname,
                password:hasPasswordFromBcrypt,
                email: data.email,
                address:data.address,
                phoneNumber:data.phonenumber,
                gender:data.gender==='1' ? true :false,               
                roleId:data.roleId                
            })
            resolve("Ok! create success ")
        }catch(e){
            reject(e);
        }
    })   
  
}

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

let getAllUser = (req,res) => {
    return new Promise((resolve,reject) => {
        try{
            let allUser=db.User.findAll({
                raw: true,
            });
            resolve(allUser);

        }catch(e){
            reject(e);
        }
        
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve,reject) => {
        try{
            let user = await db.User.findOne({
                where:{id:userId},
                raw:true,

            });
            if(user){
                resolve(user);
            }
            else{
                resolve({});
            }

        }catch(e){
            reject(e);
        }
    })

}

let updateUserData = (data) => {
    return new Promise(async (resolve,reject) => {
        try{
            let user = await db.User.findOne({
                where:{id:data.id}
            })
            if(user){
                user.firstName=data.firstname;
                user.lastName=data.lastname;
                user.address=data.address;
                await user.save();
                let allUsers= await db.User.findAll();
                resolve(allUsers);
            }else{
                resolve();
            }

        }catch(e){
            console.log(e);
        }
    })
    
}

let deleteUserById = (userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            let user=await db.User.findOne({
                where:{id:userId}
            })
            if(user){
                await user.destroy();
            }
            resolve();//return

        }catch(e){
            reject(e);

        }
    })

}

module.exports = {
    CreateNewUser:CreateNewUser,
    getAllUser:getAllUser,
    getUserInfoById:getUserInfoById,
    updateUserData:updateUserData,
    deleteUserById:deleteUserById
}