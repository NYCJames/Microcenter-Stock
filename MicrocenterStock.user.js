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

  function displayStores() {
    console.log(inventory);
    const currentStore =
      document.querySelector(`.storeState`).textContent +
      ` -` +
      document.querySelector(`.storeName`).textContent;
    // console.log(currentStore);

    // <div class="dropdown current--store">${currentStore}</div>
    const html = `
        <button class="dropdown select--stores--button">Select Stores ⬇️</button>
        <ul class="dropdown--menu hidden">
          ${inventory
            .map(function (value) {
              // console.log(value.storeName, currentStore === value.storeName);

              //   if (value.storeName === currentStore) {
              //     return;
              //   }

              // return html
              return `<li class="dropdown--stores">
            <p>${value.storeName} (${value.storeNumber})</p>
            </li>`;
            })
            .join(`\n`)}
        </ul>
      `;

    const topBar = document.querySelector(`.prodInfo > div:nth-child(1) > div`);

    const newElement = document.createElement("div");
    newElement.classList.add(`store--picker`, `col-auto`);
    newElement.innerHTML = html;
    newElement.style.padding = `8px`;
    newElement.style.backgroundColor = `#3498DB`;
    newElement.style.border = `none`;

    // topBar.insertAdjacentHTML(`beforebegin`, html);
    // console.log(newElement);
    // topBar.innerHTML += testHtml;
    topBar.append(newElement);

    document
      .querySelector(`.select--stores--button`)
      .addEventListener(`click`, handleDropDown);

    function handleDropDown() {
      console.log(event.target);
      //   event.stopPropagation();

      document.querySelector(`.dropdown--menu`).classList.toggle(`hidden`);
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
