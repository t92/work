import './modal.css'
import { getElement } from '../../../tools'

type CallBack = () => void
class Modal{
    options: any = {
        title: '通知',
        type: 'info',
        message: 'this is a modal~',
        mask: true
    }

    private instance: Modal | undefined
    private modalFRAGMENT: any

    constructor() {
        if(this.instance instanceof Modal) return this

        this.modalFRAGMENT = document.createDocumentFragment()
        this.instance = this
    }

    private showModal(options?: any){

        const opt =
            this.options = {
                ...this.options,
                ...options
            }

        const modalDialog:HTMLElement = document.createElement('div')

        modalDialog.classList.add('modal-dialog_')

        if(opt.mask){
            modalDialog.classList.add('modal-mask_')
        }

        const modalHTML =  `<div class="modal-wrapper_">
                                <div class="modal-header_">
                                    ${ opt.title }
                                </div>
                                <div class="modal-body_">
                                    ${ opt.message }
                                </div>
                                <div class="modal-footer_"></div>
                            </div>`


        modalDialog.innerHTML = modalHTML

        this.modalFRAGMENT.appendChild(modalDialog)
        document.body.appendChild(this.modalFRAGMENT)
        this.bindEvent()
    }

    bindEvent(){
        document.body.addEventListener('click', event => {
            event.stopPropagation()

            const target = event.target as HTMLElement

            const classList: string[] = target.className.split(' ')
            if(classList.includes('modal-dialog_')){
                this.close()
            }

        })
    }

    close(cb?: CallBack){
        const dialog: HTMLElement = getElement('.modal-dialog_')
        document.body.removeChild(dialog)
        if(cb) cb()
    }

    success(msg: string) {
        this.showModal({
            type: 'success',
            message: msg
        })
    }

    error(msg: string) {
        this.showModal({
            type: 'error',
            message: msg
        })
    }

}
export default new Modal()