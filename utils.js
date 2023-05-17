const varianceThreshold = 0.5;
const weightVarianceCheck = (weight_stop) => {
    let mean=0.0;
    let variance=0;
    weight_stop.forEach(w=>mean+=w);
    mean/=weight_stop.length;
    weight_stop.forEach(w=>{
        variance+=(w-mean)*(w-mean);
    })
    variance = Math.sqrt(variance/w.length);
    console.log("variance is : "+variance);
    return variance > varianceThreshold;
}
const getWeight=(ws)=>{
    ws.sort();
    ws.reverse();
    return (ws[0]+ws[1]+ws[2])/3; 
}

module.exports = {
    weightVarianceCheck,
    getWeight
}