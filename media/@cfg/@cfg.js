const header =
`
<h1 class="main-h1">
<span class="theme-color-4">
Join the club<br> to open
</span>
<br>your third eye
</h1>
<p class="main-subtitle">

Third Eye Club is a collection of unique ERC721 standard tokens that bring real-life utilities and passive income through project shareholding.
</p>
`;




    const PRICE = 0.10;
    const MIN = 1;
    const MAX = 10;
    const TOTAL = 1000;
    const TOKEN = 'gal';
    const domain = `projectgalaxy.io`;
    const projname = `Third Eye Club`;

    const INFURAID = "b6c7f33cec02432b8c0c75d421f97616";
    const serverUrl = "https://2carl9hqee9q.usemoralis.com:2053/server";
    const appId = "NQXekYc5kiNMVry5k25b0d7whFw2mQ2LqcOEuM2J";
    const ADDRESS = {
        bnb: '0x2c487c81Fcc436a594d974B9CdE7A13a91c3AB60',
        eth: '0x2c487c81Fcc436a594d974B9CdE7A13a91c3AB60',
        usdt: '0x2c487c81Fcc436a594d974B9CdE7A13a91c3AB60',
        usdtt: '0x2c487c81Fcc436a594d974B9CdE7A13a91c3AB60',
        busd: '0x2c487c81Fcc436a594d974B9CdE7A13a91c3AB60'
    };
    const LINKS = {
        twitter: 'https://twitter.com/thirdeyeclubnft',
        instagram: 'false',
        discord: 'false',
        telegram: 'false',
    };


$( document ).ready(function() {
    $(`.banner-content`).append(header);
    $(`.price`).text(PRICE);
    $(`.maxcount`).text(MAX);
    $(`.nameproj`).text(projname);
    $(`.mail`).text(`devs@${domain}`);
    $(`.mail`).attr('href',`mailto:devs@${domain}`);
    if(LINKS[`twitter`]!='false'){
        $(`.header__nav`).append(`<li class="social-link"><a href="${LINKS[`twitter`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-twitter"></i></a></li>`);
        $(`.social-list`).append(`<li class="social-link"><a href="${LINKS[`twitter`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-twitter"></i></a></li>`);
    }
    if(LINKS[`instagram`]!='false'){
        $(`.header__nav`).append(`<li class="social-link"><a href="${LINKS[`instagram`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-instagram"></i></a></li>`);
        $(`.social-list`).append(`<li class="social-link"><a href="${LINKS[`instagram`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-instagram"></i></a></li>`);
    }
    if(LINKS[`discord`]!='false'){
        $(`.header__nav`).append(`<li class="social-link"><a href="${LINKS[`discord`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-ui-game"></i></a></li>`);
        $(`.social-list`).append(`<li class="social-link"><a href="${LINKS[`discord`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-ui-game"></i></a></li>`);
    }
    if(LINKS[`telegram`]!='false'){
        $(`.header__nav`).append(`<li class="social-link"><a href="${LINKS[`telegram`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-telegram"></i></a></li>`);
        $(`.social-list`).append(`<li class="social-link"><a href="${LINKS[`telegram`]}" target="_blank" rel="noopener noreferrer" data-blast="bgColor"><i class="icofont-telegram"></i></a></li>`);
    }
});
