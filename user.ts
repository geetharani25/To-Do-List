const mon = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mon.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique:true,
        required: true
    },
    password:{
    type: String,
    required: true
    },
})
const taskSchema = new mon.Schema({
    user:{
        type: mon.Types.ObjectId,
        ref: "User",
        required: true
    },
    mytasks:{
        type: String,
    }
})
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
exports.User = mon.model("User",userSchema);
exports.Task = mon.model("Task",taskSchema)