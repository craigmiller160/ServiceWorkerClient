
const loadTxtBtn = document.querySelector('#load-text-btn');
const serverTxt = document.querySelector('#server-text');
const loginPage = document.querySelector('#login');
const contentPage = document.querySelector('#content');

const instance = axios.create({
    baseURI: 'http://localhost:3000/api',
    withCredentials: true
});

const toggleVisiblePage = () => {
    if (loginPage.classList.contains('hidden')) {
        loginPage.classList.remove('hidden');
        contentPage.classList.add('hidden');
        return;
    }

    if (contentPage.classList.contains('hidden')) {
        contentPage.classList.remove('hidden');
        loginPage.classList.add('hidden');
    }
};

loadTxtBtn.onclick = async () => {
    const res = await instance.get('/hello');
    serverTxt.textContent = res.data;
};
