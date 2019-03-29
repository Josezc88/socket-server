import { Router, Request, Response } from "express";
import Server from "../classes/server";

const router = Router();

router.get( '/mensajes', (request:Request, response: Response) => {
    response.json({
        ok: true,
        mensaje: 'Todo esta bien'
    });
});

router.post( '/mensajes', (request:Request, response: Response) => {

    const cuerpo = request.body.cuerpo;
    const de     = request.body.de;

    const payload = {
        de: de,
        cuerpo: cuerpo;
    };

    const server = Server.getInstance();
    server.io.emit('mensaje-nuevo', payload);

    response.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post( '/mensajes/:id', (request:Request, response: Response) => {

    const cuerpo = request.body.cuerpo;
    const de     = request.body.de;
    const id     = request.params.id;

    const payload = {
        de: de,
        cuerpo: cuerpo;
    };

    const server = Server.getInstance();
    server.io.in(id).emit('mensaje-privado', payload);

    response.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

export default router;