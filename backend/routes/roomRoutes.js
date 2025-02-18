import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { createRoom, getEditorCode, joinRoom, saveCode, showProjects } from "../controllers/roomController.js"



const router = express.Router()

router.post('/room-create',authMiddleware,createRoom)
router.post('/:roomId/code-save',authMiddleware,saveCode)
router.post('/room-join',authMiddleware,joinRoom)

router.get('/projects',authMiddleware,showProjects)
router.get("/:roomId",authMiddleware,getEditorCode )


export default router