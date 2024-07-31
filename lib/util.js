export const pickKeys = (obj, ...keys) => {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
        if (keys.includes(key)) {
            result[key] = value
        }
    }
    return result
}

export const pickLanguages = (obj, ...languages) => {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
        if (!isObject(value)) {
            result[key] = value
            continue
        }
        const filteredChild = {}
        for (const [language, childValue] of Object.entries(value)) {
            if (languages.includes(language)) {
                filteredChild[language] = childValue
            }
        }
        result[key] = filteredChild
    }
    return result
}

function isObject (x) {
    return Object.prototype.toString.call(x) === '[object Object]'
}
