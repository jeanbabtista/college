import { Request, Response } from 'express'
import { Types } from 'mongoose'
import UserModel from '../models/User'
import getJsonResponse from '../lib/json'
import { models } from '../types/models'

/**
 * Middleware to find all users
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.find()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched users', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to find one user by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const findOne = (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = UserModel.findById(id)

    if (!response) throw new Error('User not found')

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully fetched user', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to create user by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response) => {
  try {
    const { username, password, email, imagePath } = req.body as models.IUser
    const user = new UserModel({ username, password, email, imagePath })
    const response = await user.save()

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully created user', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to update user by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const { username, password, email, imagePath } = req.body as models.IUser

    const response = await UserModel.findByIdAndUpdate(id, {
      username,
      password,
      email,
      imagePath
    })

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully updated user', response))
  } catch (e: any) {
    res.status(500).json(getJsonResponse(true, e.message))
  }
}

/**
 * Middleware to delete user by id in query
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as Types.ObjectId
    const response = await UserModel.findByIdAndRemove(id)

    res
      .status(200)
      .json(getJsonResponse(false, 'Successfully deleted user', response))
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
