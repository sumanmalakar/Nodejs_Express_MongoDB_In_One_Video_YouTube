import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import cookieparser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const app = express();

app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())

mongoose.connect("mongodb+srv://codesnippet02:HZzwOAda0bk0L0Hg@nodeexpressyoutube.s3iwy2j.mongodb.net/", {
    dbName: "NodeExpressMongoDbYouTube"
}).then(() => console.log("MongoDb is Connected..!"))

const userSchema = new mongoose.Schema({
    name: String,
    gmail: String,
    password: String
})

const User = mongoose.model("User", userSchema)

// C R U D 
// Create = POST (method)
// Read = GET (method)
// Update = PUT (method)
// Delete = DELETE (method)

// const name = 'suman';
// app.get('/', (req,res)=>{
//     // console.log("This is route")
//     // res.send("This is a home route")
//     // res.json({success:'true',products:[]})
//     // res.json({thanos:'spiderman'})
//     // res.send("<h2>This is html content</h2>")
//     // res.sendFile('./index.html')
//     // console.log(path.resolve())
//     // console.log(path.join(dir,'./test.html'))
//     // const dir = path.resolve()
//     // const url = path.join(dir,'./index.html');
//     // res.sendFile(url)

//     res.render('index.ejs')

// })

// app.post('/formData' , async (req,res)=>{
//     console.log(req.body)
//     const obj = {
//         name:req.body.name,
//         gmail:req.body.email
// //     }

// await User.create(obj)
//     console.log("form submitted")


//     res.json({success:true})

// })

// app.get('/about',(req,res)=>{
//     console.log("This is about route")
// })

app.get('/',async (req, res) => {
    // console.log("This is Home route")
    // res.render('register.ejs')

    const token = req.cookies.token

    // console.log(token.token)
    if(token){
        const decode = jwt.verify(token,'!@#$%^&*()')
           
        // console.log("docoded data is = ",decode)
        req.user =  await User.findById(decode.id)

        console.log("req user data = ", req.user)
         
        res.render('logout.ejs', {name:req.user.name, gmail:req.user.gmail})
    }else{
        res.render('login.ejs')
    }
})

app.get('/register', (req, res) => {
    console.log('register')
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    console.log('login')
    res.render('login.ejs')
})

app.post('/register', async (req, res) => {
    // res.render('register.ejs')
    console.log(req.body)

    const hashPassword = await bcrypt.hash(req.body.password,10);

    const obj = {
        name: req.body.name,
        gmail: req.body.gmail,
        password: hashPassword
    }
    let user = await User.findOne({gmail:obj.gmail})

    if(user) return res.redirect('/login')

     user = await User.create(obj)
    // res.json({success:'true'})
    // res.redirect('/login')
   console.log(user)

   const token = jwt.sign({ id:user._id }, '!@#$%^&*()');

    res.cookie('token', token, { expires: new Date(Date.now() + 5*60*1000), httpOnly: true })
    res.redirect('/')

})

app.post('/login', async (req, res) => {
    // console.log('login')
    // res.render('login.ejs')

    const gmail = req.body.gmail
    const password = req.body.password

    let user = await User.findOne({ gmail })

    console.log("login user data", user);

    if (!user) return res.redirect('/register')

    const isMatch = await bcrypt.compare(password,user.password)
    //  password === user.password

    if (!isMatch) return res.render('login.ejs', { msg: 'Invalid password' })

    // res.json({kuchhbhi:'de skte ho'})

    // if (isMatch) res.redirect('/logout')

    const token = jwt.sign({ id:user._id  }, '!@#$%^&*()');

    res.cookie('token', token, { expires: new Date(Date.now() + 5*60*1000), httpOnly: true })
    res.redirect('/')

})

app.get('/logout', (req, res) => {
    console.log('logout')
    // res.render('login.ejs')
     // res.redirect('/')

     res.cookie('token',null,{
        httpOnly:'true',
        expires:new Date(Date.now())
     })

   res.redirect('/')
})


const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`))

