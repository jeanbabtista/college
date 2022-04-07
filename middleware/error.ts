import createHttpError from 'http-errors'
import { Request, Response, NextFunction } from 'express'

const forwardToErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => next(createHttpError(404))

const errorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.locals = {
    message: err.message,
    error: err
  }

  res.status(err.status || 500).render('error')
}

export { forwardToErrorHandler, errorRequestHandler }
