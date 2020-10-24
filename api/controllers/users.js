const User = require('../model/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: "This email has already been used..."
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created...'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};


exports.user_login = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            };
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                };
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            _id: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        })
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                };
                res.status(401).json({
                    message: "Auth Failed"
                })
            })

        })
        .catch(() => {
            res.status(500).json({

            })
        })
};

exports.user_delete = (req, res) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            if (result.n !== 0) {
                return res.status(200).json({
                    message: "User deleted..."
                });
            } else {
                return res.status(500).json({
                    message: "User does not exist..."
                })
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


