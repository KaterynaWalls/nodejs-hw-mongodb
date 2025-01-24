import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';

import * as contactServices from './services/contacts.js';

export const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());


    const logger = pinoHttp({
        transport: {
            target: 'pino-pretty',
        },
    });

    app.use(logger);

    app.get("/contacts", async (req, res) => {
        const contacts = await contactServices.getAllContacts();
        res.json({
            status: 200,
            message:"Successfully found contacts!",
            data: contacts,
        });
    });

    app.get("/contacts/:id", async(req, res)=>{
        const {id} = req.params;
        const contacts = await contactServices.getContactById(id);
        if(!contacts) {
            return res.status(404).json({
                status: 404,
                message: `Contact with id ${id} not found`
            });
        }
        
        res.json({
            status: 200,
            message: "Successfully found contact with id {contactId}!",
            data: contacts,
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });

    app.use((error, req, res, next) => {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    });

    const port = Number(getEnvVar("PORT", 3000));
    app.listen(port, () => console.log(`Server running on ${port} port`));
};
