export const handleError = (err, res, next) => {
  err.toJSON = () => {
    return {
      message: err.message
    }
  }
  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        err.statusCode = 400
      }
      break
    case 'ValidationError':
      err.statusCode = 400
      const messages: any[] = []
      for (let name in err.errors) {
        messages.push({ message: err.errors[name].message })
      }
      err.toJSON = () => ({
        message: 'Validation error while processing your request',
        errors: messages
      })
      break
  }

  return res.status(err.statusCode).json(err)
}
