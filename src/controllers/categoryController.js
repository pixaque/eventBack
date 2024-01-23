const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const User = require('../models/user');

const {db} = require('../lib/db');
//const { Prisma } = require('@prisma/client');
//import {db} from '../lib/db';

exports.getCategories = async (req, res) => {
    
    try {
        //const id = req.params._id;

        const categories = await db.category.findMany();

        if (!categories) {
            return res.status(404).send({
               message: 'Nothing found',
            });
        }

        res.status(200).send({
            data: categories,
        });
    } catch (error) {
        res.status(500).send({
            error,
        });
    }
}

exports.newCategory = async (req, res) => {
try {
    const { catName } = req.body;

    /*
    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).send({
            message: 'User already exists',
        });
    }
    */

    //console.log(catName);

    const newCategory = await db.category.create({
        data: {
            name: catName
        }
    });

    //await newUser.save();

    res.status(201).send({
        data: newCategory,
    });
} catch (error) {
    res.status(500).send({
        status: 500,
        error: error.message,
    });
}
}
