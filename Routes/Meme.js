import express from 'express'
import auth from '../Middleware/auth.js'

const router = express.Router();

import {createMeme, getMemes, getMeme, getMemesByUser, deleteMeme, updateMeme, getMemesByTag, getMemesBySearch, getRelatedMemes, likeMeme} from '../Controllers/Meme.js';



router.get("/search",getMemesBySearch );
router.get("/",getMemes );
router.get("/:id",getMeme);
router.get("/tag/:tag",getMemesByTag );
router.post("/relatedMemes",getRelatedMemes );


router.post("/",auth, createMeme);   //first it will run middleware auth which we have implementedi in middleware  then it wil create meme
router.delete("/:id",auth, deleteMeme);
router.patch("/:id",auth, updateMeme);
router.get("/userMemes/:id",auth, getMemesByUser);
router.patch("/like/:id", auth, likeMeme);
export default router;