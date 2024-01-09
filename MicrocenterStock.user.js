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
  let myStores = new Map(retrieveSavedStores()) || [];
  //   console.log(myStores.length, inventory.length);

  function init() {
    // console.log(retrieveSavedStores());
    if (myStores.length === inventory.length) {
      return;
    }

    const mapStores = new Map();
    inventory.forEach(function (value) {
      mapStores.set(value.storeNumber, 0);
      //   console.log(mapStores);
    });
    saveStores([...mapStores]);
  }
  init();

  function saveStores(string) {
    localStorage.setItem(`savedStores`, JSON.stringify(string));
    // console.log(JSON.parse(localStorage.getItem(`savedStores`)));
  }

  function retrieveSavedStores() {
    // console.log(new Map(JSON.parse(localStorage.getItem(`savedStores`))));
    return JSON.parse(localStorage.getItem(`savedStores`));
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
              return `<div id="store--num--${
                value.storeNumber
              }" style="margin: 0px; padding: 0px; line-height: 24px" class="dropdown--stores">${value.qoh ? `🟢` : `🔴`}
            ${
              value.storeName
            } (${value.storeNumber}) ${myStores.get(value.storeNumber) === 1 ? `✅` : ``}
            </div>`;
            })
            .join(`\n`)}
        </div>
      `;

    //             <p style="display: block; padding: 0px 6px; margin: 0px;">${value.storeName} (${value.storeNumber})</p>

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

    function handleToggleStores() {
      console.log(event.target.id);
    }
  }

  async function getStockData(storeID) {
    try {
      const response = await fetch(`?storeID=${storeID}`);
      //   console.log(response.text());
      const html = await response.text();
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, "text/html");
      console.log(newDocument);
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
  //   getStockData(115);
  //   getStockData(145);
})();
