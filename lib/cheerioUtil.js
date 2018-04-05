const cArrayTojArray = (data) => {
    if(!data || !data.length) return data

    const returnData = []
    for(let i =0 ;i<data.length; i++){
        returnData.push(data[i])
    }
    return returnData
}

module.exports = {cArrayTojArray}