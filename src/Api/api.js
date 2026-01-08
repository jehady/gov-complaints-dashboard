

   const token = localStorage.getItem("auth:token") ;
   console.log("this sis the toooooooooooooooooooooooooooooken :",token) ;
 export function authHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
  };
}