import app from "./app";
import { sequelize } from "./database/init";

async function startServer() {
    try {
        sequelize.authenticate().then(()=> console.log("Connected to db")).catch((err) => console.log("ERROR db:: ", err));
        app.listen(3000, ()=> {
            console.log("Server listening at:: http://localhost:3000")
        })
    }catch (err) {
        console.log("ERROR IS:: ", err);
    }
}

startServer()