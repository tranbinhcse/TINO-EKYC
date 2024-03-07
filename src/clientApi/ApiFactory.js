import EkycApi from "./apis/EkycApi";


 
const apis = {
    EkycApi: EkycApi
}

export default {
    get: name => apis[name]
};