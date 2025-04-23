const createError = (code,message)=>{

  const error = new Error(message) //obj
  error.statusCode = code
  throw error 
}

module.exports = createError