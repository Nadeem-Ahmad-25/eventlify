 import mongoose from 'mongoose'

 const MONGODB_URI = process.env.MONGODB_URI

 const cachedData = (global as any).mongoose || {conn:null, promise:null}  
 // here we initialize a cached variable to retrieve a mongoose property from the global object 
 // in node.js this global object provide a space to store global variable 
 // the cache variable is intend to hold a cached connection to our db 

 export const connectToDatabase = async ()=> {
    if (cachedData.conn) return cachedData.conn // we check if cached connection is already there. here our connection runs for the first time.

    if(!MONGODB_URI) throw new Error("MONGODB_URI is missing !");

    cachedData.promise = cachedData.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'Eventlify',
        bufferCommands:false,
    }) // finally here we either connect to a cached connection or establish a new connection

    cachedData.conn = await cachedData.promise;

    return cachedData.conn;
 }  

 // we attempt to connect to a database in this pattern because in serverless functions or environments
 // where code could be executed multiple times in non linear fashion(not in a single continuous process), we need to manage the 
 // database connection effieciently hence cache can become really handy in such cases.
 // because each invocation of serverless function could result in a new connection to the database which can be exhausting and costly
 