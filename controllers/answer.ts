import { Request, Response } from 'express'
import { Types } from 'mongoose'
import AnswerModel from '../models/Answer'
import getJsonResponse from '../lib/json'
import { models } from '../types/models'

/**
 * Middleware to find all answers
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const response = await AnswerModel.find()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched answers', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to find one answer by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findOne = (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = AnswerModel.findById(id)

    if (!response) throw new Error('Answer not found')

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched answer', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to create answer by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response) => {
  try {
    const {
      description,
      userId,
      questionId,
      isCorrect,
      numUpVotes,
      numDownVotes
    } = req.body as models.IAnswer

    const answer = new AnswerModel({
      description,
      userId,
      questionId,
      isCorrect,
      numUpVotes,
      numDownVotes
    })

    const response = await answer.save()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully created answer', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to update answer by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId

    const {
      description,
      userId,
      questionId,
      isCorrect,
      numUpVotes,
      numDownVotes
    } = req.body as models.IAnswer

    const response = await AnswerModel.findByIdAndUpdate(id, {
      description,
      userId,
      questionId,
      isCorrect,
      numUpVotes,
      numDownVotes
    })

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully updated answer', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to delete answer by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = await AnswerModel.findByIdAndRemove(id)

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully deleted answer', response))
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
