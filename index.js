const pup = require('puppeteer');

const url = 'https://www.mercadolivre.com.br';
const searchFor = 'macbook';

let pageCount = 1;

const list = [];

(async () => {
  const browser = await pup.launch({ headless: true });
  //abre o browser - headless quer dizer no backgroud, estando falso vc ve tudo o que ocorre
  const page = await browser.newPage();
  //abre uma nova página
  console.log('Iniciei!');

  await page.goto(url);
  //vai pra url desejada (const url)
  console.log('Abrindo URL!');

  await page.waitForSelector('#cb1-edit');
  //espera pelo total carregamento do seletor desejado

  await page.type('#cb1-edit', searchFor);
  //vai até o campo do identificador (cb1-edit) e digita a variável desejada (searchFor)

  await Promise.all([
   page.waitForNavigation(),
   page.click('.nav-search-btn')
  ]) //executa a navegação da página clicando no botão de pesquisa (nav-search-btn)

  const links = await page.$$eval('.ui-search-item__group > a', el => el.map(link => link.href));

  // let pageCount = 1;

  for(const link of links) {
    if(pageCount === 5) continue;

    console.log('Página: ', pageCount);

    await page.goto(link);

    await page.waitForSelector('.ui-pdp-title');

    const title = await page.$eval('.ui-pdp-title', el => el.innerText);
    const price = await page.$eval('.andes-money-amount__fraction', el => el.innerText);
    
    const seller = await page.evaluate( () => {
      const el = document.querySelector('.ui-pdp-seller__link-trigger');
      if(!el) return null
      return el.innerText;
    })
    
    const obj = {};
    obj.title = title;
    obj.price = price;
    (seller ? obj.seller = seller : '');
    obj.link = link;

    list.push(obj);

    pageCount++;

    await new Promise(r => setTimeout(r, 3000));

  }
  console.log(list);

  await browser.close();

})();