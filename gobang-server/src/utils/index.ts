import { objRawType } from '../tools'

enum MessageType{
    TEXT_MESSAGE = 'text',
    ACTION_MESSAGE = 'play',
    HEART_MESSAGE = 'heart',
    SYS_MESSAGE = 'system'
}


class Message{
    type: string
    body: string | undefined
    status: string
    code: number

    private msgData: object | undefined
    constructor(type:string, body: string, status?: string){

        this.type = type
        this.body = body
        this.status = status ? status : 'success'
        this.code = this.status === 'success' ? 1: 0

        this.msgData = {
            type: this.type,
            body: this.body,
            status: this.status,
            code: this.code
        }
    }

    static formatMessage(msg: string): Message | null{
        try {
            const res = JSON.parse(msg)

            if(objRawType(res) === 'object'){
                return res
            }else{
                return null
            }
        } catch (error) {
            return null
        }
    }

    static errorMsg(body?: string): Message{
        return new Message(MessageType.SYS_MESSAGE, body || '消息格式错误!', 'fail')
    }

    static successMsg(body?: string): Message{
        return new Message(MessageType.SYS_MESSAGE, body || 'OK', 'success')
    }

    toString(): string {
        return JSON.stringify(this.msgData)
    }
}

export {
    Message,
    MessageType
}