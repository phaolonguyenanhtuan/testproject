require('dotenv').config();
import { attachment } from 'express/lib/response';
import nodemailer from 'nodemailer';

let sentSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Đặt lịch khám 👻" <phaolonguyenanhtuan@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend)       
        , 
      });    
}

let getBodyHTMLEmail = (dataSend) => {
                let result = '';
                if(dataSend.language === 'vi') {
                  result = 
                  `
                  <h3>Xin chào ! ${dataSend.patientName} ! </h3>
                  <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online</p>
                  <p>Thông tin đặt lịch khám bệnh : </p>
                  <p><b>Thời gian : ${dataSend.time}</b></p>
                  <p><b>Bác sĩ khám : ${dataSend.doctorName}</b></p>
                  <p>Nếu các thông tin là đúng sự thật thì vui lòng click vào đường link bên dưới để xác nhận hoàn tất thủ tục đặt lịch khám bệnh</p>
                  <p><a href=${dataSend.redirectLink} target = "_blank">Click here </a></p>
                  <p>Sincelery thanks !</p>    
                      `
                }

                if(dataSend.language === 'en') {
                  result = 
                  `
                  <h3>Dear! ${dataSend.patientName} ! </h3>
                  <p>you received this email because you booked an online medical appointment on web</p>
                  <p>Schedule of Appointment : </p>
                  <p><b>Time: ${dataSend.time}</b></p>
                  <p><b>Doctor : ${dataSend.doctorName}</b></p>
                  <p>if information is true please clikc on below link to confirm and complete the procedure  to book appointment</p>
                  <p><a href=${dataSend.redirectLink} target = "_blank">Click here </a></p>
                  <p>Sincelery thanks !</p>  
                  `
                }
                return result;
}


let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = '';
  if(dataSend.language === 'vi') {
    result = 
     `
     <h3>Xin chào ${dataSend.patientName} ! </h3>
     <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online thành công</p>
     <p>Thông tin hoá đơn/đơn thuốc được gửi trong file đính kèm : </p>
     
     <p>Sincelery thanks !</p>    
        `
  }

  if(dataSend.language === 'en') {
    result = 
     `
     <h3>Dear ${dataSend.patientName} ! </h3>
    <p>you received this email because you booked an online medical appointment on web</p>   
    <p>bla bla blas</p>
    <p>Sincelery thanks !</p>  
    `
  }
  return result;
}


let sendAttchment = async(dataSend) => {
  return new Promise(async(resolve,reject) => {
  try{

  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Đặt lịch khám 👻" <phaolonguyenanhtuan@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmailRemedy(dataSend),      
    attachments : [
          {   // encoded string as an attachment
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imageBase64.split("base64,")[1],
            encoding: 'base64'
        },
    ] , 
    });
    resolve(true); 
  }catch(e) {
    reject(e);
  }
})   
}

module.exports = {
    sentSimpleEmail : sentSimpleEmail,
    sendAttchment : sendAttchment,
}