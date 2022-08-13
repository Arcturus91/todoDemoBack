const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email:{
type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      trim: true,
      required: [true, 'Email is required']
    },
    password: {
      type:String,
required:true
    },
    //es muy importante
    role:{
      type:String,
      enum:["Admin","User"],
      default:"User"
    },
    firstName:{
      type:String,
      minLength:1
    },
    lastName:{
      type:String,
      minLength:1
    },
    imageUrl:{
      type:String,
      default:"https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

//debes definir si camelCase o snake_case 
