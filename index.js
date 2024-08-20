const express=require('express');
const app=express();
const port=3000;
app.post('/users',(req,res)=>{
    console.log(req.body);
    res.send('Hello World');
});
app.post('/',(req,res)=>{
    res.send('Hello World');
});
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});