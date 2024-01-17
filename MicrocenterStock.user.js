// ==UserScript==
// @name         Microcenter Stock Checker
// @namespace    https://github.com/NYCJames
// @version      1.0.0
// @description  Check new and open box stock at selected stores
// @author       NYCJames
// @match        https://www.microcenter.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microcenter.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  const myStores2 = new Map(retrieveSavedStores(`myStores2`)) || [];

  function init() {
    renderDropdownStores();
    renderOtherStockButton();
  }
  init();

  function saveStores(key, string) {
    localStorage.setItem(key, JSON.stringify(string));
  }

  function retrieveSavedStores(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function renderDropdownStores() {
    const html = `
        <button class="dropdown select--stores--button">Select Stores ⬇️</button>
        <div class="dropdown--menu hidden">
          ${inventory
            .map(function (value) {
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
      const storeID = event.target.dataset.storeNumber;
      const storeLocation = event.target.dataset.storeLocation;

      if (myStores2.has(storeID)) {
        myStores2.delete(storeID);
        event.target.innerText = event.target.innerText.slice(0, -1);
      } else {
        myStores2.set(storeID, storeLocation);
        event.target.innerText = event.target.innerText + `✅`;
      }
      saveStores(`myStores2`, [...myStores2]);
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

    function handleCheckSavedStoresStock() {
      myStores2.forEach(function (_, key) {
        getNewAndOpenBoxData(key);
      });

      document.querySelector(
        `.other--store--stock`
      ).innerHTML = `<b>Other Locations: </b>`;
    }
  }

  async function getNewAndOpenBoxData(storeID) {
    try {
      const storeLocation = myStores2.get(storeID);
      const response = await fetch(`?storeID=${storeID}`);
      const html = await response.text();
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, "text/html");

      const stock = JSON.parse(
        newDocument
          .querySelector("head > script:nth-child(59)")
          .textContent.match(/dataLayer.push\((.*?)\)/s)[1]
          .replace(/[']/g, `"`)
      );

      if (newDocument.querySelector(`.inventoryCnt`)) {
      }
      stock[`new`] =
        newDocument
          .querySelector(`.inventoryCnt`)
          ?.childNodes[0].textContent.trim() || `0`;

      let openBoxData = newDocument
        .querySelector("#content > script:nth-child(6)")
        .textContent.match(/OpenBoxLayer\=(.*?)\;/s);

      if (openBoxData) {
        openBoxData = openBoxData[1].replace(/[']/g, `"`);
        openBoxData = JSON.parse(openBoxData);
        stock[`openBox`] = openBoxData;
      }

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

      document
        .querySelector(`.other--store--stock`)
        .appendChild(storeInventoryElement);
    } catch (error) {
      console.log(error);
    }
  }
})();
