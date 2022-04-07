import { Request, Response } from 'express'
import { Types } from 'mongoose'
import QuestionTagModel from '../models/QuestionTag'
import getJsonResponse from '../lib/json'
import { models } from '../types/models'

/**
 * Middleware to find all question tags
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const response = await QuestionTagModel.find()

    res
      .status(200)
      .json(
        getJsonResponse(false, 'Successfully fetched question tags', response)
      )
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to find one question tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findOne = (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = QuestionTagModel.findById(id)

    if (!response) throw new Error('Question tag not found')

    res
      .status(200)
      .json(
        getJsonResponse(false, 'Successfully fetched question tag', response)
      )
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to create question tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response) => {
  try {
    const { questionId, tagId } = req.body as models.IQuestionTag

    const questionTag = new QuestionTagModel({
      questionId,
      tagId
    })

    const response = await questionTag.save()

    res
      .status(200)
      .json(
        getJsonResponse(false, 'Successfully created question tag', response)
      )
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to update question tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const { questionId, tagId } = req.body as models.IQuestionTag

    const response = await QuestionTagModel.findByIdAndUpdate(id, {
      questionId,
      tagId
    })

    res
      .status(200)
      .json(
        getJsonResponse(false, 'Successfully updated question tag', response)
      )
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to delete question tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = await QuestionTagModel.findByIdAndRemove(id)

    res
      .status(200)
      .json(
        getJsonResponse(false, 'Successfully deleted question tag', response)
      )
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
