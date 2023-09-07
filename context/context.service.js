

class Context { 

    constructor () {   
        const dotenv = require('dotenv');
        const env = process.argv[2];
        const result = dotenv.config({ path: `./.env_${env}` });

        
        if (result.error) {
            console.log(result.error);
        }

        this.ExpressPort = process.env.PORT;
        this.Environment = process.env.environment;
    }
}

module.exports = new Context();
