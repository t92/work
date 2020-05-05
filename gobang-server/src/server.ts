const ws = require('nodejs-websocket')
import { Message, MessageType } from './utils'
import { GameCatch, User, Game, Point } from './game'
import { getParams } from './tools'


const createServer = (port: number) => {

    const games = new GameCatch()
    const server = ws.createServer(connection => {

        const params = getParams(connection.path)
        const user = new User(params.user)

        let game: Game
        // 被邀请的用户 查找gameid
        if(params.invite) {
            game = games.find(params.invite)
        } else {
            game = new Game()
        }

        user.joinGame(game, connection)
        games.catch(game)

        console.log(`用户==(${params.user})==加入了`, games, game.getId())

        // result 只能接收字符串
        connection.on('text', result => {

            if(typeof result === 'string') {
                const message = Message.formatMessage(result)
                if(message) {
                    switch(message.type) {
                        case MessageType.TEXT_MESSAGE : {
                            break
                        }

                        case MessageType.ACTION_MESSAGE: {
                            game.update(JSON.parse(message.body!) as Point)
                            break
                        }

                        case MessageType.HEART_MESSAGE: {
                            break
                        }
                    }
                    connection.sendText(Message.successMsg().toString())
                }else{
                    connection.sendText(Message.errorMsg().toString())
                }
            }else{
                connection.sendText(Message.errorMsg().toString())
            }
        })

        connection.on('close', result => {
            console.log('关闭连接', result)
        })
        connection.on('error', result => {
            console.log('异常关闭', result)
        })
    }).listen(port)

    function boardcast(msg: any): void {
        console.log(msg)
    }

    return server
}

createServer(3000)

console.log(' server is running~ at == ', new Date().toLocaleTimeString())
