// ==UserScript==
// @name         Microcenter Stock Checker (Development Version)
// @namespace    https://github.com/NYCJames
// @version      2024.01.09
// @description  Check new and open box stock at selected stores
// @author       NYCJames
// @match        https://www.microcenter.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microcenter.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  // const inventory = document.querySelector("#content > script:nth-child(7)").textContent
  let myStores = new Map(retrieveSavedStores(`savedStores`)) || [];
  // console.log(myStores.size, inventory.length);

  // get and set or delete after every selection
  const myStores2 = new Map(retrieveSavedStores(`myStores2`)) || [];

  function init() {
    // console.log(retrieveSavedStores(`savedStores`));
    // if (myStores.size === inventory.length) {
    //   return;
    // } else {
    //   const mapStores = new Map();
    //   inventory.forEach(function (value) {
    //     mapStores.set(value.storeNumber, 0);
    //     // console.log([...mapStores]);
    //   });
    //   saveStores(`savedStores`, [...mapStores]);
    // }
    renderDropdownStores();
    renderOtherStockButton();
    // renderAllStoreData();
  }
  init();

  function saveStores(key, string) {
    // console.log(JSON.parse(localStorage.getItem(`savedStores`)));
    localStorage.setItem(key, JSON.stringify(string));
  }

  function retrieveSavedStores(key) {
    // console.log(new Map(JSON.parse(localStorage.getItem(key))));
    return JSON.parse(localStorage.getItem(key));
  }

  function renderDropdownStores() {
    // console.log(inventory);
    // const currentStore =
    //   document.querySelector(`.storeState`).textContent +
    //   ` -` +
    //   document.querySelector(`.storeName`).textContent;
    // console.log(currentStore);

    // <div class="dropdown current--store">${currentStore}</div>
    const html = `
        <button class="dropdown select--stores--button">Select Stores ⬇️</button>
        <div class="dropdown--menu hidden">
          ${inventory
            .map(function (value) {
              // console.log(value.storeName, currentStore === value.storeName);

              //   if (value.storeName === currentStore) {
              //     return;
              //   }

              // return html
              // instead of id, set property storenum=storenumber and storelocation=storestate + store city
              return `<div data-in-stock="${
                value.qoh ? true : false
              }" data-store-number="${value.storeNumber}" data-store-location="${value.storeName}" style="margin: 0px; padding: 0px; line-height: 24px" class="dropdown--stores">
              ${
                value.qoh ? `🟢` : `🔴`
              } ${value.storeName} (${value.storeNumber}) ${myStores2.has(value.storeNumber) ? `✅` : ``}
              </div>`;
            })
            .join(`\n`)}
        </div>
      `;

    // myStores.get(value.storeNumber) === 1
    // id="store--num--${value.storeNumber}"

    // const topBar = document.querySelector(`.prodInfo > div:nth-child(1) > div`);
    const topBar = document.querySelector(`#tabs`);

    // const newElement = document.createElement("li");
    // newElement.classList.add(`store--picker`, `mainDropdownNav`);
    // newElement.innerHTML = html;
    // newElement.style.position = `relative`;
    // newElement.style.display = `inline-block`;
    // newElement.style.padding = `0`;
    // newElement.style.width = `132px`;
    // newElement.style.fontSize = `14px`;

    // topBar.insertAdjacentHTML(`beforebegin`, html);
    // console.log(newElement);
    // topBar.innerHTML += testHtml;
    // topBar.append(newElement);

    document
      .querySelector("#tabs > li.m15312.generalNav.last.mainDropdownNav")
      .insertAdjacentHTML(
        `afterend`,
        `<li class="store--picker mainDropdownNav" style="position: relative; display: inline-block; padding: 0px; width: 132px; font-size: 14px">${html}</li>`
      );

    const dropdownButton = document.querySelector(`.select--stores--button`);

    dropdownButton.style.padding = `4px`;
    dropdownButton.style.backgroundColor = `#3498DB`;
    dropdownButton.style.border = `none`;
    dropdownButton.style.color = `white`;

    dropdownButton.addEventListener(`click`, handleDropDown);

    function handleDropDown() {
      //   console.log(event.target);
      //   event.stopPropagation();

      document.querySelector(`.dropdown--menu`).classList.toggle(`hidden`);
    }

    const dropdownMenu = document.querySelector(`.dropdown--menu`);
    dropdownMenu.style.position = `absolute`;
    dropdownMenu.style.backgroundColor = `#f1f1f1`;
    dropdownMenu.style.minWidth = `250px`;
    dropdownMenu.style.boxShadow = `0px 8px 16px 0px rgba(0,0,0,0.2)`;
    dropdownMenu.style.zIndex = `1`;

    dropdownMenu.addEventListener(`click`, handleToggleStores);

    function handleToggleStores(event) {
      //   console.log(event);
      //   console.log(event.target.id.slice(-3));
      //   console.log(myStores.get(event.target.id.slice(-3)));

      // console.log(event, event.target.dataset);
      const storeID = event.target.dataset.storeNumber;
      const storeLocation = event.target.dataset.storeLocation;
      // const inStock = event.target.dataset.inStock;
      // console.log(storeID + storeLocation);

      // if (myStores.get(event.target.id.slice(-3)) === 0) {
      //   myStores.set(event.target.id.slice(-3), 1);
      //   event.target.innerText = event.target.innerText + `✅`;
      // } else {
      //   myStores.set(event.target.id.slice(-3), 0);
      //   // console.log(event.target.textContent.slice(0, -2));
      //   event.target.innerText = event.target.innerText.slice(0, -1);
      // }
      // //   console.log(myStores.get(event.target.id.slice(-3)));
      // saveStores(`savedStores`, [...myStores]);

      if (myStores2.has(storeID)) {
        myStores2.delete(storeID);
        event.target.innerText = event.target.innerText.slice(0, -1);
      } else {
        myStores2.set(storeID, storeLocation);
        event.target.innerText = event.target.innerText + `✅`;
      }
      saveStores(`myStores2`, [...myStores2]);
      // console.log(myStores2);
    }
  }

  function renderOtherStockButton() {
    document
      .querySelector(`.banner-margin`)
      .insertAdjacentHTML(
        `afterend`,
        `<div class="other--store--stock"><b>Other Locations: </b></div>`
      );

    const html = `<button class="check--stock--button">Check Stock</button>`;
    document
      .querySelector(
        "#product-details-control > div.row.prodInfo.banner-md-margin-medium.banner-margin-small > div.col"
      )
      .insertAdjacentHTML(`afterend`, html);

    document
      .querySelector(`.check--stock--button`)
      .addEventListener(`click`, handleCheckSavedStoresStock);

    function handleCheckSavedStoresStock(event) {
      console.log(`clicked`, event);
      console.log(myStores2);

      myStores2.forEach(function (value, key) {
        getNewAndOpenBoxData(key);
      });

      document.querySelector(
        `.other--store--stock`
      ).innerHTML = `<b>Other Locations: </b>`;
    }
  }

  async function getNewAndOpenBoxData(storeID) {
    try {
      // const stock = {};
      const storeLocation = myStores2.get(storeID);

      const response = await fetch(`?storeID=${storeID}`);
      //   console.log(response.text());
      const html = await response.text();
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, "text/html");
      // console.log(newDocument);
      console.log(storeID);

      // dataLayer[2]
      // dataLayer[5][2][`items`][0]

      // console.log(
      //   newDocument
      //     .querySelector("head > script:nth-child(59)")
      //     .textContent.match(/dataLayer.push\((.*?)\)/s)[1]
      // );
      // console.log(
      //   JSON.parse(
      //     newDocument
      //       .querySelector("head > script:nth-child(59)")
      //       .textContent.match(/dataLayer.push\((.*?)\)/s)[1]
      //       .replace(/[']/g, `"`)
      //   )
      // );

      // stock.productInfo = JSON.parse(
      //   newDocument
      //     .querySelector("head > script:nth-child(59)")
      //     .textContent.match(/dataLayer.push\((.*?)\)/s)[1]
      //     .replace(/[']/g, `"`)
      // );

      const stock = JSON.parse(
        newDocument
          .querySelector("head > script:nth-child(59)")
          .textContent.match(/dataLayer.push\((.*?)\)/s)[1]
          .replace(/[']/g, `"`)
      );

      // .match(/dataLayer.push\((.*?)\)/s)

      // head > script:nth-child(59)
      // console.log(newDocument.dataLayer[2]);
      // console.log(dataLayer[5][2][`items`][0]);

      // check inventory
      // if qoh = 1 then fetch new data
      if (newDocument.querySelector(`.inventoryCnt`)) {
      }
      stock[`new`] =
        newDocument
          .querySelector(`.inventoryCnt`)
          ?.childNodes[0].textContent.trim() || `0`;
      // const newData =
      //   newDocument.querySelector(`.inventoryCnt`)?.textContent || `SOLD OUT`;
      // console.log(newData);

      let openBoxData = newDocument
        .querySelector("#content > script:nth-child(6)")
        .textContent.match(/OpenBoxLayer\=(.*?)\;/s);

      // console.log(openBoxData);
      // console.log(
      //   productInfo.textContent
      //     .replaceAll("\n", "")
      //     .match(/OpenBoxLayer\=(.*?)\;/)[1]
      //     ?.replace(/[']/g, `"`)
      // );
      // console.log(productInfo.textContent.replaceAll("\n", "").split(`;`));
      // console.log(
      //   productInfo.textContent
      //     ?.match(/OpenBoxLayer\=(.*?)\;/s)[1]
      //     .replaceAll("\n", "")
      //     .replace(/[']/g, `"`)
      // );

      if (openBoxData) {
        // console.log(stock);
        // myStoresStock.set(storeID, stock);
        // console.log(myStoresStock);
        // return stock;

        // console.log(openBoxData);
        openBoxData = openBoxData[1].replace(/[']/g, `"`);
        openBoxData = JSON.parse(openBoxData);
        stock[`openBox2`] = openBoxData;
        // console.log(openBoxData);

        // .replaceAll("\n", "")
      }

      // console.log(newDocument.querySelector("#openboxmodal > div").children);
      const openBox2 = [
        ...newDocument.querySelector("#openboxmodal > div")?.children,
      ].slice(1);
      if (!!openBox2) {
        const openBoxData = [];
        // console.log(openBox2);

        openBox2.map(function (value) {
          const openBoxItem = {};

          // console.log(value.children[0].innerText.trim().split(`\n`)[0].trim());
          // console.log(
          //   Number.parseFloat(
          //     value.querySelector(`.descriptor`).innerText.slice(3)
          //   )
          // );
          // console.log(value.children[1].innerText.trim());
          // console.log(value.children[2].innerText.trim().split(`\n`)[0]);
          // console.log(value.children[2].innerText.trim().split(`\n`)[1].trim());
          // console.log(value.querySelector(`.pricing`).dataset.price);

          openBoxItem.condition = value.children[0].innerText
            .trim()
            .split(`\n`)[0]
            .trim();
          openBoxItem.id = Number.parseFloat(
            value.querySelector(`.descriptor`).innerText.slice(3)
          );
          openBoxItem.warranty = value.children[1].innerText.trim();
          openBoxItem.salesTerms =
            value.children[2].innerText.trim().split(`\n`)[0] +
            `, ` +
            value.children[2].innerText.trim().split(`\n`)[1].trim();
          openBoxItem.price = value.querySelector(`.pricing`).dataset.price;

          // console.log(openBoxItem);
          openBoxData.push(openBoxItem);
        });

        stock.openBox = openBoxData;
      }

      //   console.log(newDocument.querySelector(`.openboxOptions`));
      //   console.log(newDocument.querySelector(`#openboxmodal`));

      //   window.navigator.
      //   console.log(response.body.getReader().read());
      // console.log(response.text());

      //   const data = await response.text();
      //   console.log(data);

      //   $.get(
      //     "https://www.microcenter.com/product/652777/asrock-x670e-taichi-amd-am5-eatx-motherboard?storeID=115.html",
      //     _,
      //     function (text) {
      //       alert($(text).find(".separator-wrapped"));
      //     }
      //   );
      // console.log(stock);
      // myStoresStock.set(storeID, stock);
      // console.log(myStoresStock);
      // return stock;

      //////////////////// OOS

      // <div class="inventory">
      //   <div class="icon-group">
      //     <i class="fa-solid fa-circle-xmark text-burnt"></i>
      //     <span>
      //       <span
      //         class="matrix-61 hide-text"
      //         style="position:absolute; right:0;"
      //       ></span>
      //       SOLD OUT<span class="storeName"> at Mayfield Heights Store</span>
      //     </span>
      //   </div>
      // </div>;

      //////////////// IN STOCK

      // <div class="inventory">
      //   <div class="icon-group">
      //     <i class="fa-solid fa-circle-check text-slate-blue"></i>
      //     <span>
      //       <span
      //         class="matrix-57 hide-text"
      //         style="position:absolute; right:0;"
      //       ></span>
      //       <span class="inventoryCnt">
      //         25+ <span class="msgInStock">NEW IN STOCK</span>
      //       </span>
      //       <span class="storeName"> at St. Louis Park Store</span>
      //     </span>
      //   </div>

      //   <div class="openboxOptions">
      //     <button
      //       type="button"
      //       data-toggle="modal"
      //       data-target="#openBoxModal"
      //       class="openBoxModalButton"
      //     >
      //       <i class="fa-solid fa-circle-check text-slate-blue"></i> 6 Open Box:{" "}
      //       <span id="opCostNew"> from $175.96</span>
      //     </button>
      //   </div>
      // </div>;

      console.log(stock);

      let html2 = `<div class="inventory">
         <div class="icon-group">`;
      if (stock.new !== `0`) {
        html2 =
          html2 +
          `<i class="fa-solid fa-circle-check text-slate-blue"></i>
             <span>
               <span
                 class="matrix-57 hide-text"
                 style="position:absolute; right:0;"
               ></span>
               <span class="inventoryCnt">
                 ${stock.new} <span class="msgInStock">NEW IN STOCK</span>
               </span>
               <span class="storeName"> at ${storeLocation}(${storeID})</span>
             </span>
           </div>`;
      } else {
        html2 =
          html2 +
          `<i class="fa-solid fa-circle-xmark text-burnt"></i>
             <span>
               <span
                 class="matrix-61 hide-text"
                 style="position:absolute; right:0;"
               ></span>
               SOLD OUT<span class="storeName"> at ${storeLocation}(${storeID})</span>
             </span>
           </div>`;
      }

      if (stock.openBox) {
        html2 =
          html2 +
          `<div class="openboxOptions">
             <button
               type="button"
               data-toggle="modal"
               data-target="#openBoxModal"
               class="openBoxModalButton"
             >
               <i class="fa-solid fa-circle-check text-slate-blue"></i> ${stock.openBox.length} Open Box: 
               <span id="opCostNew"> from $175.96 at ${storeLocation}(${storeID})</span>
             </button>
           </div>
         </div>`;
      } else {
        html2 = html2 + `</div>`;
      }

      // console.log(html2);

      // document
      //   .querySelector("#pnlInventory > div")
      //   .insertAdjacentHTML(`afterend`, html2);

      // instead of fetching and rendering all on load, add button and fetch data and render after click

      const html3 = `<div class="stock--${storeID} tg-wrap">
      <b>${storeLocation} (${storeID})</b>
<table border="1">
<tbody>
<tr>
<td style="width: 400px;">$${stock.productPrice}</td>
<td style="width: 800px;">${
        stock.new !== `0`
          ? `<i class="fa-solid fa-circle-check text-slate-blue"></i>`
          : `<i class="fa-solid fa-circle-xmark text-burnt"></i>`
      } ${stock.new || 0} New In Stock</td>
<td style="width: 500px;">${
        stock.openBox
          ? `<i class="fa-solid fa-circle-check text-slate-blue"></i>`
          : `<i class="fa-solid fa-circle-xmark text-burnt"></i>`
      } ${stock.openBox?.length || 0} Open Box</td>
<td style="width: 800px;">${
        stock.openBox
          ? `from $${Number.parseFloat(
              stock.openBox[0]?.price
            )} to $${Number.parseFloat(
              stock.openBox[stock.openBox?.length - 1]?.price
            )}`
          : `—`
      }</td>
</tr>
${
  stock.openBox
    ? `
    ${stock.openBox.map(function (value) {
      return `<tr>
      <td style="width: 400px>${value.list + value.name}</td>
      <td style="width: 400px>${value.position}</td>
      <td style="width: 400px>$${value.id}</td>
      <td style="width: 400px>${value.price}</td>
      </tr>`;
    })}
  `
    : ``
}
</tbody>
</table>
      </div>`;

      // document
      //   .querySelector(`.other--store--stock`)
      //   .insertAdjacentHTML(`afterend`, html3);

      // SCRAPE OPEN BOX DATA from document.querySelector("#openboxmodal > div") but exclude "row clearance-heading"
      // document.querySelector("#openboxmodal > div").children

      // document
      //   .querySelector(`.banner-margin`)
      //   .insertAdjacentHTML(`afterend`, html2);

      const storeInventoryElement = document.createElement(`div`);
      storeInventoryElement.classList.add(`stock--${storeID}`, `tg-wrap`);
      storeInventoryElement.innerHTML = `
      <b>${storeLocation} (${storeID})</b>
<table border="1">
<tbody>
<tr>
<td style="width: 400px;">$${stock.productPrice}</td>
<td style="width: 800px;">${
        stock.new !== `0`
          ? `<i class="fa-solid fa-circle-check text-slate-blue"></i>`
          : `<i class="fa-solid fa-circle-xmark text-burnt"></i>`
      } ${stock.new || 0} New In Stock</td>
<td style="width: 500px;">${
        stock.openBox
          ? `<i class="fa-solid fa-circle-check text-slate-blue"></i>`
          : `<i class="fa-solid fa-circle-xmark text-burnt"></i>`
      } ${stock.openBox?.length || 0} Open Box</td>
<td style="width: 800px;">${
        stock.openBox
          ? `from $${Number.parseFloat(
              stock.openBox[0]?.price
            )} to $${Number.parseFloat(
              stock.openBox[stock.openBox?.length - 1]?.price
            )}`
          : `—`
      }</td>
</tr>
${
  stock.openBox
    ? `
    ${stock.openBox
      .map(function (value) {
        return `<tr>
      <td style="width: 2000px">${value.list + `, ` + value.name}</td>
      <td style="width: 50px">${value.position}</td>
      <td style="width: 200px">${value.id}</td>
      <td style="width: 100px">$${value.price}</td>
      </tr>`;
      })
      .join(``)}
  `
    : ``
}
</tbody>
</table>
      `;
      // console.log(storeInventoryElement);

      document
        .querySelector(`.other--store--stock`)
        .appendChild(storeInventoryElement);
    } catch (error) {
      console.log(error);
    }
  }

  // function renderAllStoreData() {}

  // console.log(myStoresStock);
  // getNewAndOpenBoxData(`055`);
  // getNewAndOpenBoxData(`145`);
  // getNewAndOpenBoxData(`125`);
  // getNewAndOpenBoxData(`075`);
})();

// FASTER
// console.time("Execution Time");
// function functionToBeMeasured() {
//   `"\nproductsLayer=[{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '219.99',\n'brand': 'ASUS',\n'category': 'Motherboards'\n}];\naddOnLayer=[{\n'name': 'Trident Z5 Neo RGB Series 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL30 Dual Channel Desktop Memory Kit F5-6000J3038F16GX2-TZ5NR - Black',\n'id': '653734',\n'price': '119.99',\n'brand': 'G.Skill',\n'category': 'Desktop Memory/RAM',\n'list': 'Add Ons',\n'position': 1\n},{\n'name': 'Flare X5 Series 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL36 Dual Channel Desktop Memory Kit F5-6000J3636F16GX2-FX5 - Black',\n'id': '653727',\n'price': '104.99',\n'brand': 'G.Skill',\n'category': 'Desktop Memory/RAM',\n'list': 'Add Ons',\n'position': 2\n},{\n'name': 'Ripjaws S5 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL36 Dual Channel Desktop Memory Kit F5-6000J3636F16GX2-RS5K - Black',\n'id': '664095',\n'price': '104.99',\n'brand': 'G.Skill',\n'category': 'Desktop Memory/RAM',\n'list': 'Add Ons',\n'position': 3\n},{\n'name': 'Motherboard Installation Service',\n'id': '609476',\n'price': '79.99',\n'brand': '',\n'category': 'Build, Install, & Repair Services',\n'list': 'Add Ons',\n'position': 4\n}];\nfrequentlyBoughtLayer=[{\n'name': 'G.Skill Trident Z5 Neo RGB Series 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL30 Dual Channel Desktop Memory Kit F5-6000J3038F16GX2-TZ5NR - Black',\n'id': '653734',\n'price': '119.99',\n'brand': 'G.Skill',\n'list': 'Frequently Bought Together',\n'position': 1\n}];\nOpenBoxLayer=[{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '153.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 1\n},{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '175.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 2\n},{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '175.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 3\n},{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '175.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 4\n}];\nsendfrequentlyboughtImpression();\nsendproductImpression();\n"
// `
//     .match(/OpenBoxLayer\=(.*?)\;/s)[1]
//     ?.replaceAll("\n", "")
//     .replace(/[']/g, `"`);
// }
// await functionToBeMeasured();

// console.timeEnd("Execution Time");

// SLOWER
// console.time("Execution Time");
// function functionToBeMeasured() {
//   `"\nproductsLayer=[{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '219.99',\n'brand': 'ASUS',\n'category': 'Motherboards'\n}];\naddOnLayer=[{\n'name': 'Trident Z5 Neo RGB Series 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL30 Dual Channel Desktop Memory Kit F5-6000J3038F16GX2-TZ5NR - Black',\n'id': '653734',\n'price': '119.99',\n'brand': 'G.Skill',\n'category': 'Desktop Memory/RAM',\n'list': 'Add Ons',\n'position': 1\n},{\n'name': 'Flare X5 Series 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL36 Dual Channel Desktop Memory Kit F5-6000J3636F16GX2-FX5 - Black',\n'id': '653727',\n'price': '104.99',\n'brand': 'G.Skill',\n'category': 'Desktop Memory/RAM',\n'list': 'Add Ons',\n'position': 2\n},{\n'name': 'Ripjaws S5 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL36 Dual Channel Desktop Memory Kit F5-6000J3636F16GX2-RS5K - Black',\n'id': '664095',\n'price': '104.99',\n'brand': 'G.Skill',\n'category': 'Desktop Memory/RAM',\n'list': 'Add Ons',\n'position': 3\n},{\n'name': 'Motherboard Installation Service',\n'id': '609476',\n'price': '79.99',\n'brand': '',\n'category': 'Build, Install, & Repair Services',\n'list': 'Add Ons',\n'position': 4\n}];\nfrequentlyBoughtLayer=[{\n'name': 'G.Skill Trident Z5 Neo RGB Series 32GB (2 x 16GB) DDR5-6000 PC5-48000 CL30 Dual Channel Desktop Memory Kit F5-6000J3038F16GX2-TZ5NR - Black',\n'id': '653734',\n'price': '119.99',\n'brand': 'G.Skill',\n'list': 'Frequently Bought Together',\n'position': 1\n}];\nOpenBoxLayer=[{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '153.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 1\n},{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '175.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 2\n},{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '175.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 3\n},{\n'name': 'Z790-V Prime WiFi Intel LGA 1700 ATX Motherboard',\n'id': '671030',\n'price': '175.9600',\n'brand': 'ASUS',\n'category': 'Motherboards',\n'list': 'Single Product Clearance',\n'position': 4\n}];\nsendfrequentlyboughtImpression();\nsendproductImpression();\n"
// `
//     .replaceAll("\n", "")
//     .match(/OpenBoxLayer\=(.*?)\;/)[1]
//     ?.replace(/[']/g, `"`);
// }
// await functionToBeMeasured();

// console.timeEnd("Execution Time");
