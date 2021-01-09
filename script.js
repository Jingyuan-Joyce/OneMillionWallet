// Set your API key here
const APIKEY = 'ckey_4d5b231f1a584413ae6c3715bcf';

//pass in wallet address and token 
function showTransfers(contract_address){
  console.log("d");
  console.log("contract" + contract_address);
  const tableRef = document.getElementById('tokenTable')
    .getElementsByTagName('tbody')[0];
    tableRef.innerHTML = "";
    const meta = document.querySelector("#metadata");
    let wallet = document.getElementById("wallet").getAttribute("data-value");//wallet
    console.log("okk");
    console.log(wallet);
    console.log(contract_address);   
    console.log("ttt");

    tableRef.innerHTML = 
    `<thead class="thead-dark"><tr>
        <th>Timestamp (UTC)</th>
        <th>From Address</th>
        <th>From Label</th>
        <th>Ticker</th>
        <th>Transfer Type</th>
        <th>To Address</th>
        <th>To Label</th>
        <th>Amount</th>
        <th>Value</th>
    </tr></thead><tbody></tbody><br>`
    // document.body.appendChild(transferTable);

    const address = document.getElementById('address').value || 'demo.eth';

    const url = new URL(`https://api.covalenthq.com/v1/1/address/${address}/transfers_v2`);
    
    url.search = new URLSearchParams({
        key: APIKEY,
        "contract-address": contract_address
    })

    console.log("abcc");
    // Use Fetch API to get Covalent data

    fetch(url)
    .then((res) => res.json())
    .then(function(data){
      console.log('tranfer data is', data);
      // transcations = items (tokens)
      
      let transactions = data.data.items;
      console.log(transactions);
      return transactions.map(function(transaction) {
        transaction.transfers.forEach(function(transfer) {
            amount = parseInt(transfer.delta) / Math.pow(10, transfer.contract_decimals);
            tableRef.insertRow().innerHTML =
                `<td> ${transfer.block_signed_at} </td>` +
                `<td> ${transfer.from_address} </td>` +
                `<td> ${transfer.from_address_label} </td>` +
                `<td> ${transfer.contract_ticker_symbol} </td>` +
                `<td> ${transfer.transfer_type} </td>` +
                `<td> ${transfer.to_address} </td>` +
                `<td> ${transfer.to_address_label} </td>` +
                `<td> ${amount.toFixed(4)} </td>` +
                `<td> $${parseFloat(transfer.delta_quote).toFixed(2)} </td>`;
        })
    })

    })

  
    console.log(wallet);
    console.log(meta);
    console.log("ccc");

}

//1
function getData() {
    // Get key HTML elements and reset table content
     const tableRef = document.getElementById('tokenTable')
    .getElementsByTagName('tbody')[0];
    console.log(typeof(tableRef));
    tableRef.innerHTML = ""; //clear up the table

    // Covalent API request setup
    //ENS address
    const address = document.getElementById('address').value || 'demo.eth';
    const url = new URL(`https://api.covalenthq.com/v1/1/address/${address}/balances_v2`);
    url.search = new URLSearchParams({
        key: APIKEY,
        nft: true
    })
    console.log("key");
    // Use Fetch API to get Covalent data
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let tokens = data.data.items;
        //try to add all values, can't add up
        let sum =0; //! init value
        for (i of tokens){
          console.log(i);
          console.log(i.contract_address);
          let price = parseFloat(i.quote);//string undefined
          console.log(price);
          if (new String(price).valueOf() !== new String("undefined").valueOf() || !isNaN(price)){
            sum += price;
          }
        }
        let sum_s = sum.toFixed(2);
        // Update wallet metadata
        document.querySelector("#metadata").innerHTML = 
            `<li id= "wallet" data-value = ${data.data.address}> Wallet address: ${data.data.address} </li>` +
            `<li> Last update: ${data.data.updated_at} </li>` +
            `<li> Fiat currency: ${data.data.quote_currency} </li>` +
            `<li> Total Value: ${sum_s} </li>`;


        function getTables(event) {
          console.log(event);
          let selection_ = document.querySelector("#cryptotype");
          let type = selection_.options[selection_.selectedIndex];
          console.log(type.value);
          tableRef.innerHTML = "";
          //special nft cases 
          if (new String(type.value).valueOf() == new String("nft").valueOf()){
             let nftHeader = "<thead><tr><th>Image</th><th>Token</th><th>Symbol</th><th>Name</th><th>Balance</th><th>Type</th></tr></thead>";
             tableRef.innerHTML = nftHeader;
          }
          //other cases
          else{
            let cryptoHeader = '<thead><tr><th></th><th>Token</th><th>Symbol</th><th>Balance</th><th>Fiat Value</th><th>Type</th><th>Quote Rate</th></tr></thead>';
            tableRef.innerHTML = cryptoHeader;
          }
          
         
          tokens.forEach(token => {
            if (new String(token.type).valueOf() == new String(type.value).valueOf()){        
              if (new String(token.type).valueOf() == new String("nft").valueOf()){
                console.log("a");
                if (token.contract_decimals > 0) {
                    balance = parseInt(token.balance) / Math.pow(10, token.contract_decimals);
                } else {
                    balance = parseInt(token.balance);
                } 
                token.nft_data.forEach(nft=>{
                  tableRef.insertRow().innerHTML = 
            `<td><img src=${nft.external_data.image} style=width:50px;height:50px;></td>` +
            `<td> ${token.contract_name} </td>` +
            `<td> ${token.contract_ticker_symbol} </td>` +
            `<td> ${nft.external_data.name} </td>` +
            `<td> ${token.balance} </td>` +
            `<td> ${token.type} </td>`;
                });      
            
            }
              else{
                //crypto,stablecoin,dust table
              if (token.contract_decimals > 0) {
                    balance = parseInt(token.balance) / Math.pow(10, token.contract_decimals);
                } else {
                    balance = parseInt(token.balance);
                }
                console.log(token); 
            let contract_address = token.contract_address;
            tableRef.insertRow().innerHTML = 
            `<td><img src=${token.logo_url} style=width:50px;height:50px; onclick = 'showTransfers("`+contract_address+`")'></td>` +
            `<td> ${token.contract_name} </td>` +
            `<td> ${token.contract_ticker_symbol} </td>` +
            `<td> ${balance.toFixed(4)} </td>` +
            `<td> $${parseFloat(token.quote).toFixed(2)} </td>` +
            `<td> ${token.type} </td>` +
            `<td> ${token.quote_rate} </td>`;
              }
            const ul = document.getElementById('metadata');
            }
            

          });
        }

        //     return tokens.map(function(token) { // Map through the results and for each run the code below     
        // }
        console.log("aa");
  //2
        let selection = document.querySelector("#cryptotype");
        console.log(selection);
        selection.addEventListener('change',getTables);
    
    });
}
   
    //try filter out the table 
  
    // filterRows = function () {
    //   let theType = selection.options[selection.selectedIndex].value;
    //   tokens.forEach(myfunction); 
    //   function myfunction(td)
    //   {
    //     console.log(td);
    //     if (td.type != theType) {
    //       document.querySelectorAll()

    //     }
    //   }
    // }
              
        
