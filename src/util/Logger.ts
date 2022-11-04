export class Logger {
    loggerSignature="";
   
    static log(logLevel:string,logMessage:string) {
      console.log(`${new Date().toISOString()} - UPMCLIENT - ${logLevel} -> ${logMessage}`); 
    }

    static failure(message:string){
        Logger.log('FAILURE',message);
    }
    static sucess(message:string){
        Logger.log('SUCESS',message);
    }
    static warn(message:string){
        Logger.log('WARN',message);
    }
    static debug(message:string){
        Logger.log('DEBUG',message);
    }
  }