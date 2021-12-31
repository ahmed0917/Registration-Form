const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },


    phone: {
        type: Number,
        min: 10,
        unique: true,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: [true, "Email id is already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    work: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
    },

    // confirmpassword: {
    //     type: String,
    //     required: true
    // },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})



// We are hasing password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 12);
    }
    next();
})


// We are generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token
    }
    catch (err) {
        console.log(err)
    }
}


module.exports = new mongoose.model("User", userSchema);