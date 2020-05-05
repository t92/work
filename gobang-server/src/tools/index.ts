
function objRawType(value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}


function getParams(path: string): any{

    const str = path.substr(2),
         params = str.split('&'),
         res = {}

    params.forEach( item => {
        const arr = item.split('=')
        res[arr[0]] = arr[1]
    })

    return res
}


export {
    objRawType,
    getParams
}