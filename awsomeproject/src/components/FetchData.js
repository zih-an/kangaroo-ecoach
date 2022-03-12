

export async function getData(REQUEST_URL={},tk="1") {
  let responseJson=JSON.stringify({data:[{name:"finallyAdmin",price:199}]});;
  try {
    let response = await fetch(REQUEST_URL, {
      method: "GET",
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      headers:{
        token:tk
      }
    });
    responseJson = await response.text(); // 返回的内容
  } catch (error) {
    console.error(error);
  }
  return JSON.parse(responseJson);
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












