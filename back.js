const express=require('express')    
const sql=require('mysql')



//paso 2: activamos el server con el express
const server=express()   

server.use(express.json())

//paso 3: hacemos la conexion a la base de datos 
const conexionBD=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'integrador' //este sera el nombre de nuestro base de datos
})


// esto es para dejar hacer los metodos
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});




server.get('/solicitud',(req,res)=>{
    let mysql='SELECT * FROM solicitudes'

    conexionBD.query(mysql,(err,resuls)=>{
        if(err) throw err
        if (resuls.length>0){
            res.json(resuls)
        } else{
            res.send('no hay datos disponibles')
        }
    })

})



server.post('/nueva-solicitud',(req,res)=>{
    const mysql= 'INSERT INTO solicitudes SET ?'

    const solicitudOBJ={
        idsolicitudes : req.body.idsolicitudes,
        nombre : req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono,
        solicitud: req.body.solicitud,
        comentario: req.body.comentario,
    }

    conexionBD.query(mysql,solicitudOBJ,err=>{
        if (err) throw err

        res.send('solicitud añadida con exito')
    })
})

server.put('/actualizar-solicitud/:id',(req,res)=>{
    const id=req.params
    const {nombre,correo,telefono,solicitud,comentario}= req.body

    const mysql= `UPDATE solicitudes SET nombre ="${nombre}", correo="${correo}", telefono="${telefono}", solicitud="${solicitud}",comentario="${comentario}" where idsolicitudes = ${id.id}`
    
    conexionBD.query(mysql, err =>{
        if (err) throw err

        res.send('solicitud actualizada')
    })
})

server.delete('/eliminar-solicitud/:id',(req,res)=>{
    const id= req.params
    const mysql =`DELETE FROM solicitudes where idsolicitudes = ${id.id} `
    
    conexionBD.query(mysql,err=>{
        if (err) throw err

        res.send ('solicitud eliminada')
    })
})









server.post('/login',(req,res)=>{
    const {usuario,contraseña}=req.body //a qui cree una constante que es el usuario y la contraseña que estoy recibiendo del metodo post del front

    const values=[usuario,contraseña] //a qui cree la contante que encerrara el user y la contraseña que atrape del metodo post arriba
    const mysql= 'SELECT * from loguin where usuario=? and contraseña=?' // a qui creo la consulta que es un select de la base de datos pero que estara esperando un user y una contraseña

    // cuando creo la conexion le mando la consulta y el valor para que agarre el usuario y la contraseña de ahi 
    conexionBD.query(mysql,values,(err,result)=>{
        if(err){
            res.status(500).send(err)  // a qui le digo si hay un error mando un status de 500 y el error 
        }else{
            if(result.length>0){                     // y si no hay error envieme un ok y los datos 
                res.status(200).send({
                    // 'idlogin':result[0].idlogin,
                    // 'usuario':result[0].usuario,
                    // 'password':result[0].password // aqui no debemos devolver la contraseña ya que alguien lo debe ver
                })
            }else{         // y si no hay valores que reciba envieme status 400 y el error 
                res.status(400).send('usuario no existe')
            }
        }
    })

})


// server.delete('/eliminar-pokemon/:idpokemones',(req,res)=>{
//     const id= req.params
//     const mysql =`DELETE FROM pokemones where idpokemones = ${id.idpokemones} `
    
//     conexionBD.query(mysql,err=>{
//         if (err) throw err

//         res.send ('pokemon eliminado con exito')
//     })
// })



const PORT= process.env.PORT || 3006
server.listen(PORT,()=>{
    console.log('server en el puerto', PORT)
})