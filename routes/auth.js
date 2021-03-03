const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  //LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const saveUser = await user.save();
    //res.send(saveUser);
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});  
 
router.post("/login",async (req, res) => {
    //console.log(!Object.keys(req.body).length);
    if(!Object.keys(req.body).length) return res.status(400).send('Bad parameter');

    //Validate req data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Checking email is exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email or password is wrong');
    
    //Checking password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Email or password is wrong');
    //res.send("Logged in!");
    
    //Create and Asign a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

});

module.exports = router;