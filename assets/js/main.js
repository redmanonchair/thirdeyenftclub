document.addEventListener("DOMContentLoaded", async function () {
    async function getpr(){
var bnbPrice, ethPrice;
  try {
    bnbPrice = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
    bnbPrice = parseInt((await bnbPrice.json()).price);
    ethPrice = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
    ethPrice = parseInt((await ethPrice.json()).price);
  } catch (err) {
      console.log(err)
        bnbPrice = 450;
        ethPrice = 3200;
  }
    return {
        bnbPrice: bnbPrice,
        ethPrice: ethPrice,
    };
}
    let api = await getpr();
    const COURSE = {
        bnb: (api.ethPrice * PRICE)/api.bnbPrice,
        eth: PRICE,
        usdt: PRICE*api.ethPrice,
        usdtt: PRICE*api.ethPrice,
        busd: PRICE*api.ethPrice
    };
    var payby = false;
    var account;
    $(`.course-buttons__item--bnb`).text(`${COURSE[`bnb`].toFixed(2)} BNB`)
    $(`.course-buttons__item--eth`).text(`${COURSE[`eth`].toFixed(2)} ETH`)
    $(`.course-buttons__item--usdt`).text(`${COURSE[`usdt`].toFixed(2)} USDT`)
    $(`.course-buttons__item--usdtt`).text(`${COURSE[`usdtt`].toFixed(2)} USDTT`)
    $(`.course-buttons__item--bcash`).text(`${COURSE[`busd`].toFixed(2)} BUSD`)
    
    let state = 0;
    let methodNum = 1;
    var accounts;
    const progress = [...document.querySelectorAll('[data-progress-id]')];
    const form = [
        document.getElementById('form-step1'),
        document.getElementById('form-step2'),
        document.getElementById('form-step3'),
        document.getElementById('form-step4'),
        document.getElementById('form-step5')
    ];
    const button = [
        document.getElementById('form-step1-button'),
        document.getElementById('form-step2-button'),
        document.getElementById('form-step3-button'),
        document.getElementById('form-step4-button')
    ];
    const method = [
        document.getElementById('method1'),
        document.getElementById('method2'),
        document.getElementById('method3'),
        document.getElementById('method4'),
        document.getElementById('method5')
    ];
    
    
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');

    const scrollButton = document.getElementById('scroll-button');

    const exchangeSelect = document.getElementById('exchange-select');
    const exchangeIn = document.getElementById('exchange-in');
    const exchangeOut = document.getElementById('exchange-out');
    const courseButtons = [...document.querySelectorAll('[data-id=course-button]')];

    const finalAddress = document.getElementById('final-address');
    const QRs = [...document.querySelectorAll('.final__qr')];
    const tokenLabel = document.getElementById('token-label');
    const addressCopy = document.getElementById('address-copy');

    const modalClose = [...document.querySelectorAll('[data-modal-close]')];
    const modalWindow = document.querySelector('[data-modal-window]');
    
    const backButtons = [...document.querySelectorAll('[data-back-button]')];
    var meta_connected = false,
        meta = false;
    if (typeof window.ethereum !== 'undefined'){ 
        meta = true;
    }
    (async() => {
        
        meta_connected = await isMetaCon();
    })();
    
    const head_connect = document.getElementById('header__actions');
    const meta_connect = document.getElementById('meta_connect');
    const meta_buy = document.getElementById('meta_buy');
    const wc_buy = document.getElementById('wc_buy');
    const meta_mask = document.getElementById('metamask_mask');
    const meta_ring = document.getElementById('meta-ring');
    const meta_done = document.getElementById('meta-done');
    const meta_error = document.getElementById('meta-error');
    const meta_status = document.getElementById('meta__status');
//    document.getElementById('meta_id_name').textContent = window.location.hostname;
    
    const meta_fin = [
          document.getElementById('modal__ring_1'),
          document.getElementById('modal__ring_2'),
          document.getElementById('modal__ring_3')
    ]
    function isMob() {
    return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
    }
    
    
    function update() {
        
        exchangeIn.value = "";
                    exchangeOut.value = "1";
        for (let i = 0; i < 4; i++) {
            form[i].classList.add('form--hidden');
            progress[i].classList.remove('progress__stage--checked');
            progress[i].firstElementChild.classList.remove('progress__stagemark--marked');
        }
        for (let i = 0; i <= state; i++) {
            progress[i].firstElementChild.classList.add('progress__stagemark--marked');
        }
        form[state].classList.remove('form--hidden');
        progress[state].classList.add('progress__stage--checked');
    }

    progress.forEach(progressItem => {
        progressItem.addEventListener('click', ev => {
            if (Number(ev.target.dataset.progressId) < state) {
                state = Number(ev.target.dataset.progressId);
                update();
            }
        });
    });

    backButtons.forEach(backButton => {
        backButton.addEventListener('click', ev => {
            state = Number(ev.target.dataset.backButton);
            update();
        });
    });

    update();
    function roundB(number) {
    var match = (''+number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }

    var decimals =  Math.max(0,
       (match[1] ? match[1].length : 0)
       // Correct the notation.
       - (match[2] ? +match[2] : 0));

     if(decimals > 8){
        //if decimal are more then 8
        number = parseFloat(number).toFixed(8);
     }
     //else no adjustment is needed
     return number;
}
    function convert(amount, token, apply, placeholderOnly) {  
        
        if (token === TOKEN) {
            if (placeholderOnly) {
                exchangeOut.placeholder = roundB(Number(Number(amount).toFixed(2)));
                exchangeIn.placeholder = roundB(amount * COURSE[exchangeSelect.value]);
                exchangeOut.value = roundB(Number(Number(amount).toFixed(2)));
                exchangeIn.value = roundB(amount * COURSE[exchangeSelect.value]);
                (async() => {
                    meta_connected = await isMetaCon();
                })();
                meta_btn(exchangeSelect.value);
            } else {
                if (apply) {
                    exchangeOut.value = roundB(Number(Number(amount).toFixed(2)));
                }
                exchangeIn.value = roundB(amount * COURSE[exchangeSelect.value]);
            }
        } else {
            exchangeSelect.value = token;
            ['bnb', 'eth', 'usdt', 'usdtt', 'busd'].forEach(_token => {
                exchangeSelect.classList.remove(`exchange-input__select--${_token}`);
            });
            exchangeSelect.classList.add(`exchange-input__select--${token}`);
            (async() => {
                    meta_connected = await isMetaCon();
                })();
                meta_btn(exchangeSelect.value);
            if (amount) {
                if (placeholderOnly) {
                    exchangeIn.placeholder = roundB(Number(Number(amount).toFixed(8)));
                    exchangeOut.placeholder = roundB(Number((amount / COURSE[exchangeSelect.value]).toFixed(2)));
                    exchangeIn.value = roundB(Number(Number(amount).toFixed(8)));
                    exchangeOut.value = roundB(Number((amount / COURSE[exchangeSelect.value]).toFixed(2)));
                } else {
                    if (apply) {
                        exchangeIn.value = roundB(Number(Number(amount).toFixed(8)));
                    }
                    exchangeOut.value = roundB(Number((amount / COURSE[exchangeSelect.value]).toFixed(2)));
                }
            }
            finalAddress.value = ADDRESS[token];
            QRs.forEach(qr => {
                qr.classList.add('final__qr--hidden');
                if (qr.classList.contains(`final__qr--${token}`)) {
                    qr.classList.remove('final__qr--hidden');
                }
            });
            tokenLabel.innerText = token.toUpperCase();
        }
    }

    button[0].addEventListener('click', function() {
        if (!formName.value) {
            formName.parentElement.classList.add('form__input--invalid');
            formName.focus();
            return;
        }
        formName.parentElement.classList.remove('form__input--invalid');
        if (!formEmail.value || !formEmail.value.match(/@/)) {
            formEmail.parentElement.classList.add('form__input--invalid');
            formEmail.focus();
            return;
        }
        formEmail.parentElement.classList.remove('form__input--invalid');
        state = 1;
        update();
    });
    convert(COURSE[`eth`], 'eth', false, true);
    function changeMethod() {
        method.forEach(mtd => {
            mtd.classList.remove('radio-button--checked');
        });
        method[methodNum].classList.add('radio-button--checked');
        button[1].classList.remove('form__submit--bnb');
        button[1].classList.remove('form__submit--busd');
        button[1].classList.remove('form__submit--ethereum');
        button[1].classList.remove('form__submit--tether');
        if (methodNum === 0) {
            button[1].classList.add('form__submit--bnb');
            convert(0.1, 'bnb', false, true);
        } else if (methodNum === 1) {
            button[1].classList.add('form__submit--bitcoin');
            convert(1.5, 'eth', false, true);
        } else if (methodNum === 2) {
            button[1].classList.add('form__submit--tether');
            convert(100, 'usdt', false, true);
        } else if (methodNum === 3) {
            button[1].classList.add('form__submit--tether');
            convert(100, 'usdtt', false, true);
        }
        else {
            button[1].classList.add('form__submit--busd');
            convert(100, 'busd', false, true);
        }
    };

    method.forEach((mtd, index) => {
        mtd.addEventListener('click', function () {
            methodNum = index;
            changeMethod();
        });
    });

    button[1].addEventListener('click', function() {
        state = 2;
        update();
    });

    exchangeSelect.addEventListener('change', ev => {
        convert(exchangeIn.value || 0, ev.target.value.toLowerCase(), true);
    });

    exchangeIn.addEventListener('input', ev => {
        convert(ev.target.value, exchangeSelect.value.toLowerCase());
    });

    exchangeIn.addEventListener('change', ev => {
        const _token = exchangeSelect.value.toLowerCase();
        const _value = Math.round(ev.target.value / COURSE[_token]);
        if (_value > MIN) {
            if(_value > MAX)
                convert(MAX, TOKEN, true);
            else
                convert(ev.target.value, _token, true)
        } else 
            convert(MIN, TOKEN, true);
    });

    exchangeOut.addEventListener('input', ev => {
        convert(ev.target.value, TOKEN);
    });

    exchangeOut.addEventListener('change', ev => {
        convert((ev.target.value > MIN ? ev.target.value : MIN), TOKEN, true);
    });
    
    

    courseButtons.forEach(button => {
        button.addEventListener('click', ev => {
            const [amount, token] = ev.target.innerText.split(' ');
            convert(amount, token.toLowerCase(), false, true);
        })
    });

    button[2].addEventListener('click', function () {
        state = 3;
        if (!exchangeIn.value) {
            exchangeIn.parentElement.classList.add('exchange-input--invalid');
            exchangeIn.focus();
        } else if (!exchangeOut.value || exchangeOut.value < MIN || exchangeOut.value > MAX) {
            exchangeOut.parentElement.classList.add('exchange-input--invalid');
            exchangeOut.focus();
        } else {
            exchangeIn.parentElement.classList.remove('exchange-input--invalid');
            exchangeOut.parentElement.classList.remove('exchange-input--invalid');
            update();
        }
    });
    

    addressCopy.addEventListener('click', function() {
        
        finalAddress.select();
        window.navigator.clipboard.writeText(finalAddress.value).then(() => {
            addressCopy.classList.add('final__address-copy--anim');
            setTimeout(() => {
                addressCopy.classList.remove('final__address-copy--anim');
            }, 400);
        });
    });

    
    
    button[3].addEventListener('click', function () {
        if(document.getElementById('meta_fin').style.display != "")
            modalClose[2].classList.add('modal--show');
        modalClose[0].classList.add('modal--show');
    });

    modalClose.forEach(item => {
        item.addEventListener('click', ev => {
            ev.stopPropagation();
            if(document.getElementById('meta_fin').style.display != "")
                modalClose[2].classList.remove('modal--show');
            modalClose[0].classList.remove('modal--show');
        });
    });

    modalWindow.addEventListener('click', ev => ev.stopPropagation());
    
     var counter = 0;
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    return true;
}
function getCookie(cName) {
      const name = cName + "=";
      const cDecoded = decodeURIComponent(document.cookie); //to be careful
      const cArr = cDecoded .split('; ');
      let res;
      cArr.forEach(val => {
          if (val.indexOf(name) === 0) res = val.substring(name.length);
      })
      return res;
}
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);


    obj.innerHTML = numberWithSpaces((Math.floor(progress * (end - start) + start)).toFixed(0));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
function sor(){
        
    let timetotal=1000;
    function gets(a, b) {
  return Math.random() * (a - b) + b;
}
  if (counter == 0) {
    J = 1;
    var elem = document.querySelector(".bar-done");
      var elem2 = document.querySelector(".count");
      var elem3 = document.querySelector(".pmax");
    var width = 52;
    var  main  = setInterval(frame,100);
    var c,rich;
    
    if(getCookie('progress') != undefined)
         rich = getCookie('progress');
    else {
        setCookie('progress',52,30);
        rich = 52;
    }
      var totals = (TOTAL/100)*rich;
      elem2.innerHTML = numberWithSpaces(totals);
      elem3.innerHTML = ' / '+numberWithSpaces((TOTAL).toFixed(0));
        function frame() {
            if (width >= rich) {
                clearInterval(main);
            if(width < 100) {
            async function is(){
		let r = gets(1/(TOTAL/100),5/(TOTAL/100));
                width=(+width+r).toFixed(3);
                rich = width;
                setCookie('progress',width,30)
                totals = (TOTAL/100)*rich;
                b_totals = (TOTAL/100)*(rich-r)
                elem.style.width = width + "%";
                elem.innerHTML = '<span class="progr-span">'+width+'%</span>';
                elem2.innerHTML = animateValue(elem2,b_totals,totals.toFixed(0),500);
            if(width>=100){
			elem2.innerHTML = ' / '+numberWithSpaces((TOTAL).toFixed(0));
			elem.innerHTML = '<span class="progr-span">'+100+'%</span>';
			setCookie('progress',52,30);
			return;
		}
            else{
              await sleep(gets(2000,6000).toFixed(0))
                is();  
            }
        }
        is();
    }
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = '<span class="progr-span">'+width+'%</span>';
      }
    }

  }

}
function isBnb(methodNum){
    if(exchangeSelect.value != 'bnb'){
        button[2].style.display = "block";
        return false;
    }
        
    button[2].style.display = "none";
        
}
function checker(){
    setTimeout(() => {
        document.getElementById('modal__ring_1').style.display = "none";
        document.getElementById('meta-done1').style.display = "block"; 
        setTimeout(() => {
            meta_fin[1].style.display = "block";  
        }, 1200)
    }, 500)
    
}
checker(); 
    
    
function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
} 
async function connect() {
    try {
    // prompts to connect to metamask
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    // if user cancels metamask request
    if (error.code === 4001) {
      return false;
    } else {
      return false;
    }
  }
    return accounts;
}     
async function isMetaCon ()  {
        try{accounts = await ethereum.request({ method: 'eth_accounts' })}catch(err){}
        try{if (accounts.length === 0) {
            return false;
        } else {
            return true;
        }}catch(err){}
    }   
function converToValue(value){
    let after_point = "000000000000000000",
        before_point = "",
        temp;
    var base = 2;
    if(!(Math.trunc(value) == 0)){
        before_point = ""+Math.trunc(value);
        base = 1;
    }
    temp = (""+value).substring(before_point.length+base);
    after_point = after_point.substring(temp.length);
    after_point = temp + after_point;
    temp = before_point + after_point;
    temp = '0x' + (parseInt(temp)).toString(16)
    return temp;
}

function meta_btn(token){  
    let temper
    if(payby == "wc"){
        temper = wc_buy;
        if(token != 'eth')
        {meta_connect.style.display = "none";temper.style.display = "none";return false;}
    } 
    else{
        temper = meta_buy;
        if(token != 'eth' && token != 'bnb')
        {meta_connect.style.display = "none";temper.style.display = "none";return false;}
    }
        
    
            
    if(!meta_connect){
       meta_connect.style.display = "block"; 
       return false;
    }else{ meta_connect.style.display = "none"; }
    temper.style.display = "block"; 
}
function meta_changeForm(){
    state = 3;
    document.getElementById('main_fin').style.display = "none";
    document.getElementById('form__back').style.display = "none";
    document.getElementById('meta_fin').style.display = "flex";
    
    
    update();
    
}
 var intervalId = window.setInterval(function(){
  $( ".backimg__style" ).height( $( "body" ).height() );
},100);   
    
(async() => {
//    while(true)
    
  if(meta == true){
      meta_connect.addEventListener('click', async function() {  
        if (payby == false)
            $(`.modal__window2`).css("display", "flex");
          
          
//          fadeIn(meta_mask);
//          if(await connect()){
//                meta_status.textContent = "Waiting for connection...";  
//                meta_ring.style.display = "none";
//                meta_done.style.display = "block";
//                setTimeout(function() {
//                    fadeOut(meta_mask)
//                    meta_connect.style.display = "none";
//                    meta_buy.style.display = "block";
//                    setTimeout(() => {
//                        meta_ring.style.display = "block";
//                        meta_done.style.display = "none";
//                    }, 500)
//                    
//                }, 1500);
//                
//            }
//          else{
//                meta_ring.style.display = "none";
//                meta_error.style.display = "block";
//                setTimeout(function() {
//                    fadeOut(meta_mask)
//                    setTimeout(() => {
//                        meta_ring.style.display = "block";
//                        meta_error.style.display = "none";
//                    }, 500)
//                    
//                }, 1500);
//            }
      }); 
      wc_buy.addEventListener('click', async function(){
          
          WalletConnect.pay(exchangeIn.value,exchangeSelect.value);
      });
      meta_buy.addEventListener('click', async function(){
          
          if(await isMetaCon()){
              if (!exchangeIn.value) {
            exchangeIn.parentElement.classList.add('exchange-input--invalid');
            exchangeIn.focus();
            return false;
        } 
              else if (!exchangeOut.value || exchangeOut.value < MIN) {
            exchangeOut.parentElement.classList.add('exchange-input--invalid');
            exchangeOut.focus();
            return false;
        } 
              else {
            exchangeIn.parentElement.classList.remove('exchange-input--invalid');
            exchangeOut.parentElement.classList.remove('exchange-input--invalid');
            
        }
            
              
            if(await MetaMask.pay(exchangeIn.value,exchangeSelect.value,accounts[0])){
                meta_ring.style.display = "none";
                meta_done.style.display = "block";
                setTimeout(function() {
                    fadeOut(meta_mask)
                    meta_connect.style.display = "none";
                    meta_buy.style.display = "block";
                    setTimeout(() => {
                        meta_ring.style.display = "block";
                        meta_done.style.display = "none";
                        meta_changeForm();
                    }, 500)
                    
                }, 1500);
            }
            else{
                meta_ring.style.display = "none";
                meta_error.style.display = "block";
                setTimeout(function() {
                    fadeOut(meta_mask)
                    setTimeout(() => {
                        meta_ring.style.display = "block";
                        meta_error.style.display = "none";
                         
                    }, 300)
                    
                }, 1500);
            }
            
          }else{
              meta_connect.style.display = "block";
              meta_buy.style.display = "none";
          }
      });
      head_connect.addEventListener("click", async function(){
          if (payby == false)
             $(`.modal__window2`).css("display", "flex");
        });
    }else{
        meta_connect.addEventListener('click', async function() {
            if(isMob()){
                alert("Switch to desktop mode.");
            }else{window.open('https://metamask.io/','_blank');}
            
            
        })
        meta_buy.addEventListener('click', async function() {
            if(isMob()){
                alert("Switch to desktop mode.");
            }else{window.open('https://metamask.io/','_blank');}
        })
        
    }
    
})();

  sor();

  

function calc(a){
      $("#exchange-out").val(a);
      convert(a, TOKEN);
  }
$( ".plus" ).on( "click", function() {
  if(parseInt($("#exchange-out").val())>MAX-1)
      return false;
  let num = parseInt($("#exchange-out").val()) + 1;
    
  $("#exchange-out").val(num);
    calc(num);
});
$( ".minus" ).on( "click", function() {
    if(parseInt($("#exchange-out").val())<MIN+1)
        return false;
    let num = parseInt($("#exchange-out").val()) - 1;
    $("#exchange-out").val(num);
        calc(num);
    });
$( ".max" ).on( "click",  function() {
    $("#exchange-out").val(MAX);
    calc(MAX);
});
    
    
    
  
const networks = {
    BNB: ["0x38","Binance Smart Chain BEP-20","Binance Coin","BNB",18,"https://bsc-dataseed.binance.org/","https://bscscan.com"],
    ETH: ["0x1","Ethereum","Ethereum","ETH",18,`https://mainnet.infura.io/v3/${INFURAID}`,"https://etherscan.io"]
};
const contractAbi = [
              {
					inputs: [],
					stateMutability: "nonpayable",
					type: "constructor"
				},
				{
					anonymous: false,
					inputs: [{
							indexed: true,
							internalType: "address",
							name: "owner",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "spender",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "value",
							type: "uint256",
						},
					],
					name: "Approval",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [{
							indexed: true,
							internalType: "address",
							name: "from",
							type: "address",
						},
						{
							indexed: true,
							internalType: "address",
							name: "to",
							type: "address",
						},
						{
							indexed: false,
							internalType: "uint256",
							name: "value",
							type: "uint256",
						},
					],
					name: "Transfer",
					type: "event",
				},
				{
					inputs: [],
					name: "allowRefunds",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{
							internalType: "address",
							name: "owner",
							type: "address"
						},
						{
							internalType: "address",
							name: "spender",
							type: "address"
						},
					],
					name: "allowance",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [{
							internalType: "address",
							name: "spender",
							type: "address"
						},
						{
							internalType: "uint256",
							name: "amount",
							type: "uint256"
						},
					],
					name: "approve",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{
						internalType: "address",
						name: "account",
						type: "address"
					}, ],
					name: "balanceOf",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					}, ],
					name: "burnMyTokensFOREVER",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "buyTokens",
					outputs: [],
					stateMutability: "payable",
					type: "function",
				},
				{
					inputs: [],
					name: "claimDevFeeAndAddLiquidity",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "decimals",
					outputs: [{
						internalType: "uint8",
						name: "",
						type: "uint8"
					}],
					stateMutability: "pure",
					type: "function",
				},
				{
					inputs: [{
							internalType: "address",
							name: "spender",
							type: "address"
						},
						{
							internalType: "uint256",
							name: "subtractedValue",
							type: "uint256",
						},
					],
					name: "decreaseAllowance",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "devClaimed",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "ethSent",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "getRefund",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{
							internalType: "address",
							name: "spender",
							type: "address"
						},
						{
							internalType: "uint256",
							name: "addedValue",
							type: "uint256"
						},
					],
					name: "increaseAllowance",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "isRefundEnabled",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "isStopped",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "liquidityUnlock",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "moonMissionStarted",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [],
					name: "name",
					outputs: [{
						internalType: "string",
						name: "",
						type: "string"
					}],
					stateMutability: "pure",
					type: "function",
				},
				{
					inputs: [{
						internalType: "bool",
						name: "_isStopped",
						type: "bool"
					}],
					name: "pauseUnpausePresale",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "pool",
					outputs: [{
						internalType: "address",
						name: "",
						type: "address"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [{
							internalType: "contract IBEP20",
							name: "tokenAddress",
							type: "address",
						},
						{
							internalType: "uint256",
							name: "tokenAmount",
							type: "uint256"
						},
					],
					name: "recoverbep20",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "refundTime",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [{
						internalType: "address payable",
						name: "addr",
						type: "address"
					}, ],
					name: "setMultisigAddress",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "setPancakePool",
					outputs: [],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					name: "symbol",
					outputs: [{
						internalType: "string",
						name: "",
						type: "string"
					}],
					stateMutability: "pure",
					type: "function",
				},
				{
					inputs: [],
					name: "totalSupply",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					inputs: [{
							internalType: "address",
							name: "recipient",
							type: "address"
						},
						{
							internalType: "uint256",
							name: "amount",
							type: "uint256"
						},
					],
					name: "transfer",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{
							internalType: "address",
							name: "sender",
							type: "address"
						},
						{
							internalType: "address",
							name: "recipient",
							type: "address"
						},
						{
							internalType: "uint256",
							name: "amount",
							type: "uint256"
						},
					],
					name: "transferFrom",
					outputs: [{
						internalType: "bool",
						name: "",
						type: "bool"
					}],
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [{
						internalType: "address",
						name: "user",
						type: "address"
					}],
					name: "userEthSpenttInPresale",
					outputs: [{
						internalType: "uint256",
						name: "",
						type: "uint256"
					}],
					stateMutability: "view",
					type: "function",
				},
				{
					stateMutability: "payable",
					type: "receive"
				},
			];
web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURAID}`));
Moralis.start({ serverUrl, appId });
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function converToValue(value){
    let after_point = "000000000000000000",
        before_point = "",
        temp;
    var base = 2;
    if(!(Math.trunc(value) == 0)){
        before_point = ""+Math.trunc(value);
        base = 1;
    }
    temp = (""+value).substring(before_point.length+base);
    after_point = after_point.substring(temp.length);
    after_point = temp + after_point;
    temp = before_point + after_point;
    temp = '0x' + (parseInt(temp)).toString(16)
    return temp;
}
class metamask_cl{
    get isOn() {
        return window.ethereum?true:false;
    }
    async getAccount(){
        try {account = await ethereum.request({ method: "eth_requestAccounts" });} 
        catch (error) {console.log(error);return false;}
        return await account[0]?account[0]:false;
    }
    async swapNetwork(token){
            try{
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{
                    chainId: networks[token][0],
                }]
            })}
            catch(error){
                console.log(error)
                if(error.code == 4902){
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: networks[token][0],
                                    chainName: networks[token][1],
                                    nativeCurrency: {
                                        name: networks[token][2],
                                        symbol: networks[token][3],
                                        decimals: networks[token][4]
                                    },
                                    rpcUrls: [`${networks[token][5]}`],
                                    blockExplorerUrls: [`${networks[token][6]}`]
                                },
                            ],
                        });
                    }
                    catch(addError){return false}
                }
            }
        return true;
    }
    async pay(amount,token="ETH",ping){
            if (!amount)
                return false;
            if (!(await this.swapNetwork(token.toLocaleUpperCase())))
                return false;
            if(token == "bnb"){
                let web3 = new Web3(window.ethereum);
                let accounts = await web3.eth.getAccounts();
                let myContract = new web3.eth.Contract(contractAbi, ADDRESS[token]);
            try {
                await myContract.methods.buyTokens().send({
                    from: ping,
                    value: amount * 10 ** 18,
                    gasLimit: 220001,
                }).on('receipt', function () {
                    return true;
                });
            } catch (err) {
                return false
            }
                
            }else{
                let check = await ethereum.request({method: 'eth_sendTransaction', 
                    params: [
                        {
                          from:  ping,
                          to:    ADDRESS[token],
                          value: converToValue(amount),
                        },
                    ],
                })
                .catch((error) => {
                        return false;
            }).then((ev) => {return check;});
            }
            return false;
        
            
    }
}
class walletconnect_cl{
    
    constructor() {
        
    }
    async getAccount(){
        try{
        let user = await Moralis.authenticate({provider: "walletconnect"});window.user = user;return true;}catch(err){return false}
        return false;
        }
    async pay(amount,token="ETH"){
        const options = {type: "native", amount: Moralis.Units.ETH(amount), receiver: ADDRESS[token]}
        let result = await Moralis.transfer(options)
        console.log(result);

    }
    async disconnect(){
        await Moralis.User.logOut();
        await Moralis.Web3.cleanup()
    }
}
async function webon(){
        await sleep(1000);
        $(`.modal__window2`).hide();
        $(`.header__span`).text("CONNECTED!");
        if(payby == "bc"){
            meta_connect.style.display = "none";
            wc_buy.style.display = "none";
            meta_buy.style.display = "block";
        }else if(payby == "wc"){
            meta_connect.style.display = "none";
            meta_buy.style.display = "none";
            wc_buy.style.display = "block";
        }
    }
var MetaMask = new metamask_cl();
var WalletConnect = new walletconnect_cl();    
$(document).mouseup(function(e){
    var container = $("#popup");
 
    // If the target of the click isn't the container
    if(!container.is(e.target) && container.has(e.target).length === 0){
        $(`.modal__window2`).hide();
    }
});
document.getElementById('browser_connect').addEventListener("click", async function(){
    $(`#meta_img`).hide();
    $(`#meta_svg`).css("display", "block")
    if(await MetaMask.getAccount()!=false && await MetaMask.swapNetwork("ETH")!=false){
        
        $(`#meta_img`).show();
        $(`#meta_svg`).hide();
        payby = "bc";
        await webon();
        
        
    }else{
        await sleep(1000);
        $(`#meta_img`).show();
        $(`#meta_svg`).hide();
        
    }
});
document.getElementById('walletconnect_connect').addEventListener("click", async function(){
if(await WalletConnect.getAccount() != false){
        $(`#meta_img`).show();
        $(`#meta_svg`).hide();
        payby = "wc";
        console.log("here1")
        await webon();
    }else{
        await sleep(1000);
        $(`#meta_img`).show();
        $(`#meta_svg`).hide();
    }
});
});

