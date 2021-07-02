const form = document.querySelector('#searchForm');
const container = document.querySelector('#container');

form.addEventListener('submit', async (e) => {
    container.innerHTML="";
    e.preventDefault();
    let query = form.elements.query;
    let data = await getData(query.value);
    displayData(data);
    query.value = "";
})

const getData = async (title) => {
    const data = [];
    const config = { params: { q:title } }
    const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
    res.data.forEach((result,i) => {
        data[i] = {name: result.show.name};
        if(result.show.image) 
            data[i].img = result.show.image.medium;
        if(result.show.summary)
            data[i].summary = result.show.summary;
        try {
            data[i].network = result.show.network.name;
        } catch (e) {
            // console.log(e);
        }
        if(result.show.officialSite)
            data[i].site = result.show.officialSite;
        if(result.show.premiered)
            data[i].premiered = result.show.premiered;
        if(result.show.status)
            data[i].status = result.show.status;
    });
    return data;
}

const displayData = (data) => {
    if(data.length < 1) {
        let nothing = document.createElement('h2');
        nothing.append('No results found');
        nothing.classList.add('nothing');
        container.append(nothing);
    }
    for(let el of data) {
        let showDiv = document.createElement('div');
        showDiv.classList.add('show');                 
        if(el.name) {
            let name = document.createElement('h2');
            name.append(el.name);
            name.classList.add('showTitle');
            showDiv.append(name);
        }
        if(el.img) {
            let newImg = document.createElement('img');
            newImg.setAttribute('src', el.img);
            newImg.classList.add('img');
            showDiv.append(newImg);
        }
        if(el.network) {
            let network = document.createElement('p');
            network.append(el.network);
            network.classList.add('summary');
            showDiv.append(network);
        }
        if(el.premiered) {
            let premiered = document.createElement('p');
            premiered.append(el.premiered);
            premiered.classList.add('summary');
            showDiv.append(premiered);
        }
        if(el.status) {
            let status = document.createElement('p');
            status.append(el.status);
            status.classList.add('summary');
            showDiv.append(status);
        }
        if(el.site) {
            let site = document.createElement('a');
            site.setAttribute('href', el.site);
            site.append(el.site);
            site.classList.add('link');
            showDiv.append(site);
        }
        if(el.summary) {
            let summary = document.createElement('div');
            summary.innerHTML = el.summary;
            summary.classList.add('summary');  
            showDiv.append(summary);        
        }    
        container.append(showDiv);
    }    
}