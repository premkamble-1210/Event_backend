const express=require('express');
const app=express();
const port=3000;
app.get('/users',(req,res)=>{
    console.log('GET /users');
    res.send('Hello World');
});
app.post('/',(req,res)=>{
    res.send('Hello World');
});
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});