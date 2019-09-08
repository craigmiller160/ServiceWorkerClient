
const loginPage = document.querySelector('#login');
const contentPage = document.querySelector('#content');
const wrapper = document.querySelector('#wrapper');

const LOGIN_PAGE = 'login';
const CONTENT_PAGE = 'content';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
});

const showPage = (pageName) => {
    let firstChild = wrapper.firstChild;
    while (firstChild) {
        wrapper.removeChild(firstChild);
        firstChild = wrapper.firstChild;
    }

    if (LOGIN_PAGE === pageName) {
        wrapper.append(loginPage.content.cloneNode(true));
    }
    else {
        wrapper.append(contentPage.content.cloneNode(true));
        const loadTxtBtn = document.querySelector('#load-text-btn');
        const serverTxt = document.querySelector('#server-text');
        loadTxtBtn.onclick = async () => {
            const res = await instance.get('/hello');
            serverTxt.textContent = res.data;
        };
    }
};

showPage(LOGIN_PAGE);
