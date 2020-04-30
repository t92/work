import modal from "./packages/modal"
import { getElement } from './tools'

type PointArray = Point[]

class GoBang{
    container: string
    boards: PointArray[] = []
    max: number = 14
    winner: string | undefined
    step: number = 0
    player: string | undefined

    private prevPoint: Point | undefined
    private prevTarget: HTMLElement | undefined
    private isRevoke: boolean = false  // 是否可以悔棋

    constructor(tag: string){
        this.container = tag
        this.initState()
        this.initBoard()
        this.initEvent()
    }

    private init() {

        this.boards = []
        this.max = 14
        this.winner = undefined
        this.step = 0
        this.prevPoint = undefined
        this.isRevoke = false

        this.initState()
        this.initBoard()
        this.initEvent()
    }

    private initState() {
        this.setState()
    }

    private initBoard() {
        const container = getElement(this.container),
            boardDOM = document.createDocumentFragment()

        container.innerHTML = ''

        for(let i = 0;i<this.max;i++){
            const row: PointArray = []

            for(let j = 0;j<this.max;j++){
                const point: Point = new Point('empty', [i,j])

                boardDOM.appendChild(point.createPointDOM())
                 row.push(point)
            }
            this.boards.push(row)
        }

        container.appendChild(boardDOM)

    }

    private initEvent() {
        const container: HTMLElement = getElement(this.container)

        container.addEventListener('click', this.play.bind(this))
    }

    // 这个名字 ---     X$X
    private setState() {
        const detailDOM: HTMLElement = getElement('.play'),
            player: string = ['黑棋', '白棋'][this.step % 2]

        this.player = player

        detailDOM.innerHTML = `轮到 ${player} 落子`
    }

    private play(event: Event) {
        if(this.winner) return
        const target = event.target as HTMLElement

        if(target.nodeName.toUpperCase() === 'DIV') {
            const position: number[] = JSON.parse(target.dataset.position as string),
                point: Point = this.boards[position[0]][position[1]]

            if(point.type !== 'empty') return

            const pointType: string = this.step % 2 === 0 ? 'black' : 'white'

            this.step = this.step + 1

            point.updatePointDOM(pointType, target)

            if(this.checkWin(point)){
                this.showWin()
                return
            }

            this.prevPoint = point
            this.prevTarget = target
            this.isRevoke = true

            this.setState()
        }

    }

    /**
     * count > 5 为胜 当前棋子会被多计算一次
     * @param point
     */
    private checkWin(point: Point): boolean {
        if(this.step < 9) return false

            const boards: PointArray[] = this.boards,
                {type, position} = point,
                [row, col] = position,
                max = this.max

            // ↑ ↓
            {
                let count = 0
                for(let i=row; i<max; i++){
                    const current: Point = boards[i][col]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                for(let i=row; i>=0;i--){

                    const current: Point = boards[i][col]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                if(count > 5) {
                    return true
                }
            }

            // ← →
            {
                let count = 0
                for(let i=col; i<max; i++){

                    const current: Point = boards[row][i]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                for(let i=col; i>=0;i--){

                    const current: Point = boards[row][i]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                if(count > 5) {
                    return true
                }
            }

            // ↘ ↖
            {
                let count = 0

                for(let i=row, j=col; i<max && j<max; i++,j++){
                    const current: Point = boards[i][j]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                for(let i=row, j=col; i>=0 && j>=0; i--,j--){
                    const current: Point = boards[i][j]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                if(count > 5) {
                    return true
                }
            }
            // ↙↗
            {
                let count = 0

                for(let i=row, j=col; i<max && j>=0; i++,j--){
                    const current: Point = boards[i][j]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }

                for(let i=row, j=col; i>=0 && j<max; i--,j++){
                    const current: Point = boards[i][j]

                    if(current.type === type){
                        count++
                    }else{
                        break
                    }
                }
                if(count > 5) {
                    return true
                }
            }
        return false
    }

    private showWin(){
        this.winner = this.player
        const msg: string = `${this.winner} 赢了`

        const box: HTMLElement = getElement('.play')

        box.innerHTML = msg
        setTimeout(() => {
            modal.success(msg)
        }, 0)
    }

    reset() {
        this.init()
    }

    revoke() {
        if(!this.isRevoke) return

        if(this.winner) {
            modal.success('输都输了, 还悔个** ~~')
            return
        }

        if(!this.prevPoint){
            return
        }
        this.isRevoke = false  // 不能连续悔棋
        this.prevPoint.updatePointDOM('empty', this.prevTarget as HTMLElement)
        this.step = this.step - 1
        this.setState()
    }

}

class Point{
    type: string
    readonly position: number[]
    constructor(type: string = 'empty', position: number[]){
        this.type = type
        this.position = position
    }

    createPointDOM (): HTMLElement {
        const pointDOM: HTMLElement = document.createElement('div')
        pointDOM.className = 'point empty'
        pointDOM.dataset.position = JSON.stringify(this.position)
        return pointDOM
    }

    updatePointDOM(type: string, target: HTMLElement) {
        this.type = type
        target.className = `point ${type}`
    }
}

export default GoBang