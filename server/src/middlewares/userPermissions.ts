import {Request,Response, NextFunction}  from 'express';
const authPermission=(permissions:string[] | any)=>{
     return (req:Request, res:Response, next:NextFunction)=>{
        if (permissions.includes(req.query.role)){
            next();
        }
        else
        {
            console.log("Not allowed ")
            res.status(401).json({ error: "You don't have permissions." });
        }
     }
}
export{authPermission}