export const pagination = ({page= 1 , size =5})=>{
    if(page <1){
        page = 1 
    }
    if(size < 0 ){
        size = 5
    }
    
    const limit = size ;
    const skip = (page -1 ) * size ;
    
    return {limit , skip }
}