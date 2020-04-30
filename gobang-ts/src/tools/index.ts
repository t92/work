const getElement = (seletor: string): HTMLElement => {
    let element: HTMLElement

    try {
        element = document.querySelector(seletor) as HTMLElement
    } catch (error) {
        throw error
    }

    element = document.querySelector(seletor) as HTMLElement

    return element
}

const getArray = <T>(value: T, items: number): T[] => new Array(items).fill(value)

export {
    getElement,
    getArray
}