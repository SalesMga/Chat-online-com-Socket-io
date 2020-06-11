// aqui vai mostrar a tratátiva para mostrar um arquivo estatico, so para rota
const express = require('express');
const path = require('path'); //padra do node, nao é uma denpendecia que precisa ser instalada

const app = express(); //tem que informar para o app que tem que ter uma porta para ser acessada pelo websocket, que é um protocolo wss, diferente do protocolo http
const server = require('http').createServer(app); //definindo o protocolo http
const io = require('socket.io')(server); //aqui retorna uma funcao, mandando o server, informa o protocolo wss do websockeet

app.use(express.static(path.join(__dirname, 'public'))); //define onde fica a pasta dos arquivos publicos que serao acessados pela aplicacao
app.set('views', path.join(__dirname, 'public'));//por padrao usa viwe EJS, vou informar que sera HTML e esta dentro da public
app.engine('html', require('ejs').renderFile);//definindo a engine com HTML, pois por padrao usaria a ejs, bem comun fazer no node quando precisa usar o HTML
app.set('view engine', 'html'); //pronto! agora pode usar html aqui na nossa aplicacao

app.use('/', (req, res) => { //quando acessa o endereco do servidor padrao, a gente vai renderizar a view chamada index.hmtl
    res.render('index.html')
});

let messages = []; //var para armazenar localmente oque vem dos campos inputs ma viwe: as var 'author' e a 'message'


//toda vez que um cliente se conectar ao nosso nosso socket ele pega os dados e eu defino oque fazer com eles
io.on('connection', socket => {
    console.log(`socket conectado: ${socket.id}`); //mostra id's de quem esta conectado

    socket.emit('previousMessage', messages); //enviando array de messages salvas localmente 

    socket.on('sendMessage', data => { //aqui no backend recebo o emit e faço a tratativa, socket.on ouve os emit..
        messages.push(data); //armazena localmente na var messages
        socket.broadcast.emit('receivedMessage', data); // broacast envia para todos os sockets conectados na aplicacao, dai manda para todos conectados na aplicacao esse receivedMessage com os dados
    });
});

server.listen(3000);