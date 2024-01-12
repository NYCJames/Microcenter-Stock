// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-01-09
// @description  try to take over the world!
// @author       You
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
    if (myStores.size === inventory.length) {
      return;
    } else {
      const mapStores = new Map();
      inventory.forEach(function (value) {
        mapStores.set(value.storeNumber, 0);
        // console.log([...mapStores]);
      });
      saveStores(`savedStores`, [...mapStores]);
    }
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

  function displayStores() {
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
              return `<div data-store-number=${
                value.storeNumber
              } data-store-location="${value.storeName}" id="store--num--${value.storeNumber}" style="margin: 0px; padding: 0px; line-height: 24px" class="dropdown--stores">
              ${
                value.qoh ? `🟢` : `🔴`
              } ${value.storeName} (${value.storeNumber}) ${myStores2.has(value.storeNumber) ? `✅` : ``}
              </div>`;
            })
            .join(`\n`)}
        </div>
      `;

    //myStores.get(value.storeNumber) === 1

    // const topBar = document.querySelector(`.prodInfo > div:nth-child(1) > div`);
    const topBar = document.querySelector(`#tabs`);

    const newElement = document.createElement("li");
    newElement.classList.add(`store--picker`, `mainDropdownNav`);
    newElement.innerHTML = html;
    newElement.style.position = `relative`;
    newElement.style.display = `inline-block`;
    newElement.style.padding = `0`;
    newElement.style.width = `132px`;
    newElement.style.fontSize = `14px`;

    // topBar.insertAdjacentHTML(`beforebegin`, html);
    // console.log(newElement);
    // topBar.innerHTML += testHtml;
    topBar.append(newElement);

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
      console.log(myStores2);
    }
  }

  async function getNewAndOpenBoxData(storeID) {
    try {
      const response = await fetch(`?storeID=${storeID}`);
      //   console.log(response.text());
      const html = await response.text();
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, "text/html");
      // console.log(newDocument);

      // check inventory
      // if qoh = 1 then fetch new data
      const newData = newDocument.querySelector(`.inventoryCnt`).textContent;
      console.log(newData);

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

      if (!openBoxData) {
        return;
      }

      openBoxData = openBoxData[1].replaceAll("\n", "").replace(/[']/g, `"`);
      openBoxData = JSON.parse(openBoxData);
      console.log(openBoxData);

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
    } catch (error) {
      console.log(error);
    }
  }

  displayStores();
  // getNewAndOpenBoxData(115);
  getNewAndOpenBoxData(145);
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
