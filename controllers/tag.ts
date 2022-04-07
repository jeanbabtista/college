import { Request, Response } from 'express'
import { Types } from 'mongoose'
import TagModel from '../models/Tag'
import getJsonResponse from '../lib/json'
import { models } from '../types/models'

/**
 * Middleware to find all tags
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const response = await TagModel.find()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched tags', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to find one tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findOne = (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = TagModel.findById(id)

    if (!response) throw new Error('Tag not found')

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched tag', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to create tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response) => {
  try {
    const { title } = req.body as models.ITag
    const tag = new TagModel({ title })
    const response = await tag.save()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully created tag', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to update tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const { title } = req.body as models.ITag

    const response = await TagModel.findByIdAndUpdate(id, {
      title
    })

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully updated tag', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to delete tag by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = await TagModel.findByIdAndRemove(id)

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully deleted tag', response))
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
