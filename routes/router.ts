import { Router, Request, Response } from "express";
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/sockets";

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

// Obtener los ids de todos los usuarios conectados
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.getInstance();

    server.io.clients( (error: any, clientes: string[]) => {
        if(error) {
            res.json({
                error,
                ok: false
            });
        }

        res.json({
            ok: true, 
            clientes
        })
    });
});


// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {
    res.json({
        ok: true, 
        clientes: usuariosConectados.getLista()
    });
});

export default router;