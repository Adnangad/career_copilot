import app from "./app";
import { sequelize } from "./database/init";

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true})
        app.listen(3000, ()=> {
            console.log("Server listening at:: http://localhost:3000")
        })
    }catch (err) {
        console.log("ERROR IS:: ", err);
    }
}

startServer();