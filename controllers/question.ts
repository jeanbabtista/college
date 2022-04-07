import { Request, Response } from 'express'
import { Types } from 'mongoose'
import QuestionModel from '../models/Question'
import getJsonResponse from '../lib/json'
import { models } from '../types/models'

/**
 * Middleware to find all questions
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const response = await QuestionModel.find()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched questions', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to find one question by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findOne = (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = QuestionModel.findById(id)

    if (!response) throw new Error('Question not found')

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched question', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to create question by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body as models.IQuestion

    const question = new QuestionModel({
      title,
      description
    })

    const response = await question.save()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully created question', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to update question by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const { title, description } = req.body as models.IQuestion

    const response = await QuestionModel.findByIdAndUpdate(id, {
      title,
      description
    })

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully updated question', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to delete question by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = await QuestionModel.findByIdAndRemove(id)

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully deleted question', response))
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
