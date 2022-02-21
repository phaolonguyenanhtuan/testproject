import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req,res) => {
    //return res.send("hello world from controller");
    try {
        let data = await db.User.findAll();
        return res.render("homePage.ejs",{
            data:JSON.stringify(data)
        });
        
    } catch (error) {
        console.log(error);
        
    }
    return res.render("homePage.ejs");
}

let getAboutPage = (req,res) => {
    return res.render("test/about.ejs");
}

let getCRUD = (req,res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req,res) => {
    let message = await CRUDService.CreateNewUser(req.body);
    console.log(message);
    return res.send("from ejs");
}

let displayGetCRUD = async (req,res) => {
    let data= await CRUDService.getAllUser();
  //  console.log(data);
   // return res.send("display getCRUD");
   return res.render('displayCRUD.ejs',{
       dataTable:data,
   });
}

let getEditCRUD = async (req,res) => {
    let userId=req.query.id;
    if(userId){
        let userData= await CRUDService.getUserInfoById(userId);
        // check user not found
        return res.render("editCRUD.ejs",{
            user:userData,
        });
    }
    else {
        return res.send('User not found');

    }       
}

let putCRUD =async (req,res) => {
    let data = req.body;
    let allUpdateUsers= await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs',{
        dataTable:allUpdateUsers,
    });
}

let deleteCRUD = async(req,res) => {
    let id=req.query.id;
    if(id){
        await CRUDService.deleteUserById(id);
        return res.send('delete success');
    }   
   else{
       return res.send('not found users');
   } 

}

module.exports={
    getHomePage:getHomePage,
    getAboutPage:getAboutPage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD,
    getEditCRUD:getEditCRUD,
    putCRUD:putCRUD,
    deleteCRUD:deleteCRUD,
}