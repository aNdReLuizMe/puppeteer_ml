const pup = require('puppeteer');

const url = 'https://www.mercadolivre.com.br';
const searchFor = 'macbook';

(async () => {
  const browser = await pup.launch({ headless: false });
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

  const links = await page.$$eval('.ui-search-item__image > a', el => el.map(link => link.href));
  console.log(links);

//   await browser.close();
  //fecha o browser
})();
