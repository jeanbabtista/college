import { Request, Response } from 'express'
import { Types } from 'mongoose'
import CommentModel from '../models/Comment'
import getJsonResponse from '../lib/json'
import { models } from '../types/models'

/**
 * Middleware to find all comments
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const response = await CommentModel.find()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched comments', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to find one comment by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findOne = (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = CommentModel.findById(id)

    if (!response) throw new Error('Comment not found')

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched comment', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to create comment by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response) => {
  try {
    const { description, questionId, answerId } = req.body as models.IComment
    const comment = new CommentModel({ description, questionId, answerId })
    const response = await comment.save()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully created comment', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to update comment by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const { description, questionId, answerId } = req.body as models.IComment

    const response = await CommentModel.findByIdAndUpdate(id, {
      description,
      questionId,
      answerId
    })

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully updated comment', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to delete comment by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = await CommentModel.findByIdAndRemove(id)

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully deleted comment', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

export default {
  findAll,
  findOne,
  create,
  update,
  remove
}
