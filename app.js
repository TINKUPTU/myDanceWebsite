const express = require("express");
const path = require("path");
const fs = require("fs");
const { name } = require("pug/lib");
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/contactUsInfo');
}
const app = express();
const port = 8080;

//mongoose schema
const  contactSchema= new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String
  });

  const Contact = mongoose.model('Contact', contactSchema);
//express
app.use('/public',express.static('public'))//to serve static file
app.use(express.urlencoded())

//pug
app.set('view engine','pug')//to set the template engine as pug
app.set('views',path.join(__dirname,'views'))//to set the view directory

//endpoints
app.get('/',(req,res)=>{
    const params={ }
    res.status(200).render('home.pug',params);
})
app.get('/contact',(req,res)=>{
    const params={ }
    res.status(200).render('contact.pug',params);
})
// app.post('/contact',(req,res)=>{
//     name=req.body.name
//     email=req.body.email
//     phone=req.body.phone
//     address=req.body.address
//     var details=`The name of applicant is ${name},Email : ${email} ,Phone Number : ${phone},Address : ${address}.`
//     fs.writeFileSync('output.txt',details)
//     const params={'message':'Your form has been submitted successfully' }
//     res.status(200).render('contact.pug',params);
// })

app.post('/contact',(req,res)=>{
  var contactData=new Contact(req.body);
  contactData.save().then(()=>{
      res.send("Contact items has been saved successfully to the database")
  }).catch(()=>{
      res.status(200).send("Contact items has been not saved to the database")
  });
})

//start the server
app.listen(port,()=>{
    console.log(`The application started successfully on port ${port}`);
});