const errorMiddleware = (error,req, res, next) => {
    if (
        error.status == 500 
    ) {
        res.status(500).json({message:"Vérifiez votre connexion et reéssayez plus tard"})
    }
      next();
     
 }
 module.exports = errorMiddleware;