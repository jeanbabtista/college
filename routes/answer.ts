import { Router } from 'express'
import controller from '../controllers/answer'

const router = Router()
const { findAll, findOne, create, update, remove } = controller

router.get('/', findAll)
router.get('/:id', findOne)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router
