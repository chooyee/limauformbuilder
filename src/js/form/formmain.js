var socket=io()

// connection with server
socket.on('connect', function(){
console.log('Connected to Server')

});

// message listener from server
socket.on('newMessage', function(message){
console.log(message);
});

// message listener from server
socket.on('newJson', async function(message){
    console.log(message);
    const container = document.querySelector(".container");
    container.innerHTML = "";
    const jsonForm = await fetchJson(message.json)
    console.log(jsonForm)
    renderForm(container, jsonForm);
});

// emits message from user side
// socket.emit('createMessage', {
//     to:'john@ds',
//     text:'what kjkljd'
// });

// when disconnected from server
socket.on('disconnect', function(){
console.log('Disconnect from server')
});


const fetchJson = async (jsonUri)=>{
    return await fetch(jsonUri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })		
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //console.log("uploading image");
        return response.json(); // You can handle the API response here
    })   
    .catch((error) => {
        console.error("Error fetch json:", error);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const defaultJson = location.protocol + '//' + location.host + "/json/form.json"; 
    const jsonForm = await fetchJson(defaultJson);
    const container = document.querySelector(".container");
    renderForm(container, jsonForm);
});