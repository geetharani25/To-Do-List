const { Router } = require('express');
const {User,Task} = require('../models/user.ts');
const router = Router();
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcryp = require('bcrypt');
router.use(cookie());

const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},"secret",{
        expiresIn: maxAge
    });
}


router.post('/signup', async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;

        const user = new User({
            name: name,
            email: email,
            password: password
        });

        const result = await user.save();
        const token = createToken(result._id);
        res.send({
            message: "success",
            token
        });
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while signing up"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send({
                message: "User not Found"
            })
        }
        if (!(await bcryp.compare(req.body.password, user.password))) {
            return res.status(400).send({
                message: "Password is Incorrect"
            });
        }
        const token = createToken(user._id);
        res.send({
            message: "success",
            token
        });
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while logging in"
        });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const {id}=req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({
                message: "User not Found"
            });
        }
        const { password, ...data } = await user.toJSON();
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while fetching user data"
        });
    }
});
router.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tasks = await Task.find({user: id});
        res.json(tasks);
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while fetching tasks"
        });
    }
});

  
router.post('/tasks', async (req, res) => {
    try {
        const { user, task } = req.body;
        const newTask = new Task({
            user,
            mytasks: task
        });
        await newTask.save();
        res.send({
            message: "Task stored successfully"
        });
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while storing the task"
        });
    }
});


router.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).send({
                message: "Task not found"
            });
        }
        res.send({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while deleting the task"
        });
    }
});

router.put('/tasks/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).send({
                message: "Task not found"
            });
        }
        res.send({
            message: "Task updated successfully",
            task: updatedTask
        });
    } 
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send({
            message: "Error occurred while updating the task"
        });
    }
});
router.get('/admin', async (req, res) => {
    try {
        const tasks = await Task.find({}).populate("user").lean();
        console.log(tasks);
        res.json(tasks);
    } catch (error) {
        res.status(500).send({
            message: "Error occurred while fetching tasks"
        });
    }
  });
module.exports = router;