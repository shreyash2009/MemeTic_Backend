import express from 'express';
import MemeModel from '../Models/Meme.js'
import mongoose from 'mongoose'
export const createMeme = async (req, res) => {

    const meme = req.body;
    const newMeme = new MemeModel({
        ...meme,
        creator: req.userId,
        createdAt: new Date().toISOString()
    });

    try {
        await newMeme.save();
        res.status(201).json(newMeme)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "error"
        })
    }
}


export const getMemes = async (req, res) => {

    try {
        const memes = await MemeModel.find();
        res.status(200).json(memes)
    } catch (error) {
        res.status(404).json({
            message: "something went wrong"
        })

    }
}

export const getMeme = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const meme = await MemeModel.findById(id);
        res.status(200).json(meme)
    } catch (error) {
        res.status(404).json({
            message: "something went wrong"
        })

    }
}


export const getMemesByUser = async (req, res) => {
    const {
        id
    } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("err")
        return res.status(404).json({
            message: "user Doesn't exits"
        })
    }

    const userMemes = await MemeModel.find({
        creator: id
    })
    res.status(200).json(userMemes);
}


export const deleteMeme = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("err")
            return res.status(404).json({
                message: `No meme exist with ${id} this id`
            })
        }

        await MemeModel.findByIdAndRemove(id);

        res.status(200).json({
            message: "Meme Deleted Successfully"
        })
    } catch (error) {
        res.status(404).json({
            message: "something went wrong"
        })

    }

}


export const updateMeme = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        title,
        desc,
        creator,
        imageFile,
        tags
    } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("err")
            return res.status(404).json({
                message: `No meme exist with ${id} this id`
            })
        }
        const updatedMeme = {
            creator,
            title,
            desc,
            tags,
            imageFile,
            _id: id
        }


        await MemeModel.findByIdAndUpdate(id, updatedMeme, {
            new: true
        });

        res.status(200).json(updatedMeme)
    } catch (error) {
        res.status(404).json({
            message: "something went wrong"
        })

    }

}




export const getMemesBySearch = async (req, res) => {
    const {
        searchQuery
    } = req.query
    try {
        const name = new RegExp(searchQuery, "i")
        const memes = await MemeModel.find({
            name
        })
        res.json(memes)
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong"
        });

    }
}

export const getMemesByTag = async (req, res) => {
    const {
        tag
    } = req.params;
    try {

        const memes = await MemeModel.find({
            tags: {
                $in: tag
            }
        })
        console.log(memes.length)
        res.json(memes)
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong"
        });

    }
}



export const getRelatedMemes = async (req, res) => {
    const tags = req.body;
    try {
        const memes = await MemeModel.find({
            tags: {
                $in: tags
            }
        });
        //   console.log(tags)
        //   console.log(memes)
        res.json(memes);
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong"
        });
    }
};



export const likeMeme = async (req, res) => {

    const {
        id
    } = req.params;
    try {

        if (!req.userId) {
            res.json({
                message: "User is not authenticated"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("err")
            return res.status(404).json({
                message: `No meme exist with ${id} this id`
            })
        }

        const meme = await MemeModel.findById(id);
        const index = meme.likes.findIndex((id) => id === String(req.userId))

        if (index === -1) {
            console.log(req.userId)
            meme.likes.push(req.userId);
        } else {
            meme.likes = meme.likes.filter((id) => id !== String(req.userId));
        }

        const updatedmeme = await MemeModel.findByIdAndUpdate(id, meme, {
            new: true,
        });

        res.status(200).json(updatedmeme);
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: error.message
        });
    }
}