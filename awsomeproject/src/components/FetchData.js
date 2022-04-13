export async function getData(REQUEST_URL={},tk="1") {
  let responseJson=JSON.stringify({data:[{name:"finallyAdmin",price:199}]});
  let err= false;
  try {
    let res = await fetch(REQUEST_URL, {
      method: "GET",
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      headers:{
        token:tk
      }
    }).then(
      (response) =>{
        if(response.ok) {
          return response;
        }
        else throw (response.status);
      }
    ).catch(error =>{
      err = true;
      return error;
    });
    
    if(err === false) responseJson = await res.text();
    else responseJson = res;
  } catch (error) {
    console.error(error);
  }
  if(err === false)
  return JSON.parse(responseJson);
  else return responseJson;
  // return responseJson;

}

export async function postData(REQUEST_URL,data,tk="1"){
  let response;
  try {
    const res=await fetch(REQUEST_URL, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        "token":tk
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })

    response = await res.text();
  } catch (error) {
    console.error(error);
  }
  return JSON.parse(response);
}












