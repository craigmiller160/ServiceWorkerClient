
const loadTxtBtn = document.querySelector('#load-text-btn');
const serverTxt = document.querySelector('#server-text');

loadTxtBtn.onclick = () => {
    axios.get('http://localhost:3000/hello', {
        headers: {
            authorization: 'Hello There'
        },
        withCredentials: true
    })
        .then((res) => {
            serverTxt.textContent = res.data;
        })
        .catch((error) => {
            console.log(error);
            alert('Error with loading text');
        });
};
