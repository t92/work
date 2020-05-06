import { Message, MessageType } from "./utils"

class Game{
    from: User | undefined  // 发起者
    to: User | undefined  // 被邀请者
    status: 'wating' | 'pening' | 'end' = 'wating'
    id: string
    max: number = 14
    boards: Point[][] = []
    connects: any[] = [] // 保存socket通讯服务
    constructor() {
        this.id = '1588756428256' // Date.now().toString()
        this.initGame()
    }

    initGame() {
        for(let i = 0;i<this.max;i++){
            const row: Point[] = []

            for(let j = 0;j<this.max;j++){
                const point: Point = new Point('empty', [i,j])
                 row.push(point)
            }
            this.boards.push(row)
        }
    }

    getId(): string{
        return this.id
    }

    isJoinGame(): boolean{
        return this.status === 'wating'
    }

    update(point: any) {

        const {
            type,
            position
        } = point

        if(type === 'empty'){
            // 撤销操作
        }
        const [row, col] = position
        const mfPoint = this.boards[row][col]
        mfPoint.setType(type)

        this.notify(new Message(MessageType.ACTION_MESSAGE, mfPoint))
    }

    notify(msg: Message) {
        this.connects.forEach( conn => {
            conn.sendText(msg.toString())
        })
    }

    addUser(user: User, conn): void {
        if(this.status !== 'wating') return
        this.connects.push(conn)
        if(this.from) {
            this.to!.id = user.getId()
            this.status = 'pening'
            this.notify(new Message(MessageType.SYS_MESSAGE, 'start'))
        } else {
            this.from = user
            this.notify(new Message(MessageType.SYS_MESSAGE, 'await'))
        }
    }
}


class Point{
    type: string = 'empty'
    readonly position: number[]
    constructor(type: string, position: number[]) {
        this.type = type
        this.position = position
    }

    setType(type: string) {
        this.type = type
    }

    getType(): string{
        return this.type
    }

    getPosition(): number[]{
        return this.position
    }
}


class User{
    name: string
    id: string
    constructor(name: string) {
        this.name = name
        this.id = `id:${name}`
    }

    getId(): string{
        return this.id
    }
    joinGame(game: Game, conn) {
        game.addUser(this, conn)
    }
}

/**
 * 用于存储 game
 *  games  key 为 gameId
 */

 // 用户加入游戏时 如何缓存 connection  ???
class GameCatch{
    private games: any = {}

    catch(game: Game): void{
        this.games[game.getId()] = game
    }

    find(key: string): Game {
        return this.games[key]
    }

    remove(key: string): void{
        if(this.find(key)){
            delete this.games[key]
        }
    }
}


export {
    Game,
    GameCatch,
    User,
    Point
}