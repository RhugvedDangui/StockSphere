const sellerSearch = document.getElementById('purchaseSellerInput');
const sellerSearchResult = document.getElementById('purchaseSellerSearchResultDiv');
const productSearch = document.getElementById('productSearchBox');
const prodResultDiv = document.getElementById('productSearchResult');
const popUp = document.getElementById('popUpDiv');
const popUpSaveBtn = document.getElementById('popUpSaveBtn');
const addedProdList = document.getElementById('addedProdList');
const totalAmount = document.getElementById('totalAmount');
const netAmount = document.getElementById('netAmount');
const overallDiscount = document.getElementById('overallDiscount');
const otherAdditions = document.getElementById('tfOtherAddition');
const otherDeductions = document.getElementById('tfOtherDeduction');
const saveBtn = document.getElementById('saveBtn');
const billNoTF = document.getElementById('purchaseBillNoInput');

let currentSellerId;
let htmlContent = [];
let index = 0;
let currentProductId, currentProductName;
let productList = [];
let purchaseTotalAmount = 0;


function clearPOPUPFields(){
    document.getElementById('purchaseBatchNo').value = "";
    document.getElementById('purchaseRate').value = "";
    document.getElementById('sellingRate').value = "";
    document.getElementById('purchaseDiscount').value = "";
    document.getElementById('purchaseQty').value = "";
    document.getElementById('purchaseFreeQty').value = "";
}

function getSellerHint() {
    let temp = sellerSearch.value;
    console.log(temp);
    const data = { key: temp };
    const urlEncodedData = new URLSearchParams(data).toString();

    fetch('getSellerHint.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            sellerHint = JSON.parse(result); // Parse response as JSON
            displaySellerHint(sellerHint);
            console.log(sellerHint);

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function displaySellerHint(sellerHint) {
    if (sellerHint === "") {
        sellerSearchResult.innerHTML = "";
        return;
    }
    const content = sellerHint.map(item => {
        return `<li onclick="sellerSearch.value='${item.seller_name}'; sellerSearchResult.innerHTML=''; setSellerId(${item.seller_id}); ">${item.seller_name}</li>`;

    }).join("");

    sellerSearchResult.innerHTML = `<ul>${content}</ul>`;
}

sellerSearch.addEventListener('keyup', function () {
    if (sellerSearch.value === "") {
        displaySellerHint("");
    }
    else {
        getSellerHint();
    }
});

function setSellerId(id) {
    currentSellerId = id;
}

let productNameHint = "";
function getHintData(pname) {
    const data = { key: pname };
    const urlEncodedData = new URLSearchParams(data).toString();

    fetch('invoiceSearchGetHints.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            productNameHint = JSON.parse(result); // Parse response as JSON
            displayProductHint(productNameHint);

        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function displayProductHint(productNameHint) {
    if (productNameHint === "") {
        prodResultDiv.innerHTML = "";
        return;
    }
    const content = productNameHint.map(item => {
        return `<li onclick="showDetailsPopUp('${item.id}', '${item.name}')">${item.name}</li>`;
    }).join("");

    prodResultDiv.innerHTML = `<ul>${content}</ul>`;
}


productSearch.onkeyup = function (event) {
    if (productSearch.value === "") {
        displayProductHint("");
    }
    else {
        getHintData(productSearch.value)
    }
};

function showDetailsPopUp(prodId, prodName) {
    popUp.classList.remove('popUpMainDivHidden');
    currentProductId = prodId;
    currentProductName = prodName;
}

popUpSaveBtn.addEventListener('click', function () {
    let prodBatch = document.getElementById('purchaseBatchNo').value;
    let prodExpDate = document.getElementById('purchaseExpDate').value;
    let prodGst = document.getElementById('purchaseGst').value;
    let prodPRate = document.getElementById('purchaseRate').value;
    let prodSRate = document.getElementById('sellingRate').value;
    let prodDiscount = document.getElementById('purchaseDiscount').value;
    let prodQty = document.getElementById('purchaseQty').value;
    let prodFreeQty = document.getElementById('purchaseFreeQty').value;
    console.log(prodExpDate);

    if (!prodBatch || !prodExpDate || !prodPRate || !prodSRate || !prodQty) {
        alert("Fields Cannot be Empty");
        return;
    }
    else {
        let tempAmount = Number(prodPRate) * Number(prodQty);
        tempAmount -= (tempAmount * Number(prodDiscount) / 100);
        tempAmount += (tempAmount * (Number(prodGst) / 100));
        let y = {
            id: index, content: `
         <div class="productList">
                            <div class="productNameDiv">
                                <h4 class="productName productListText">${currentProductName}</h4>
                                <h5 class="productLabel productListLabel">Product</h5>
                            </div>
                            <div class="productBatchDiv">
                                <h4 class="productListText">${prodBatch}</h4>
                                <h5 class="productListLabel">Batch</h5>
                            </div>
                            <div class="productExpiryDiv">
                                <h4 class="productListText">${prodExpDate}</h4>
                                <h5 class="productListLabel">Expiry</h5>
                            </div>
                            <div class="productGSTDiv">
                                <h4 class="productListText">${prodGst}</h4>
                                <h5 class="productListLabel">GST</h5>
                            </div>
                            <div class="productPriceDiv">
                                <h4 class="productListText">${prodPRate}</h4>
                                <h5 class="productListLabel">P.Rate</h5>
                            </div>
                            <div class="productPriceDiv">
                                <h4 class="productListText">${prodSRate}</h4>
                                <h5 class="productListLabel">S.Rate</h5>
                            </div>
                            <div class="productQuantityDiv">
                                <h4 class="productListText">${prodQty}</h4>
                                <h5 class="productListLabel">Qty</h5>
                            </div>
                            <div class="productQuantityDiv">
                                <h4 class="productListText">${prodFreeQty}</h4>
                                <h5 class="productListLabel">Free</h5>
                            </div>
                            
                            <div class="productDiscountDiv">
                                <h4 class="productListText">${prodDiscount}</h4>
                                <h5 class="productListLabel">Discount</h5>
                            </div>
                            <div class="productAmountDiv">
                                <h4 class="productListText">${tempAmount}</h4>
                                <h5 class="productListLabel">Amount</h5>
                            </div>
                            <div class="productEditDiv">
                                <img src="Resources/Images/Icons/edit.svg" alt="edit" class="editIcon productEditIcons"
                                    onclick="editProduct()">
                                <img src="Resources/Images/Icons/delete.svg" alt="delete" class="deleteIcon productEditIcons" onclick="deleteProduct(${index})">
                            </div>
                        </div>
            `};

            htmlContent.push(y.content);
            popUp.classList.add('popUpMainDivHidden');
            let temp = { indexId: index, prodId: currentProductId, prodName: currentProductName, prodBatch: prodBatch, prodExpDate: prodExpDate, prodGst: prodGst, prodPRate: prodPRate, prodSRate: prodSRate, prodDiscount: prodDiscount, prodQty: prodQty, prodFreeQty: prodFreeQty, prodAmount: tempAmount };
            productList.push(temp);
            index += 1;
            updateProductList();
            console.log(productList);
            clearPOPUPFields();
    }
})

function calculateTotalAmount() {
    let sum = 0;
    let roundSum;
    for (let i = 0; i < productList.length; i++) {
        sum += Number(productList[i].prodAmount);
    }
    sum -= Number(sum * overallDiscount.value / 100);
    roundSum = Math.round(sum);
    displayTotalAmount(sum, roundSum);
    purchaseTotalAmount = roundSum;
}

function displayTotalAmount(sum, roundSum) {
    totalAmount.innerHTML = Number(sum.toFixed(2));
    if (roundSum - sum > 0) {
        otherAdditions.value = roundSum - sum;
    }
    else {
        otherDeductions.value = Number(Math.abs(roundSum - sum).toFixed(2));
    }

    netAmount.innerHTML = `${roundSum}`;
}

function updateProductList() {
    prodResultDiv.innerHTML = "";
    addedProdList.innerHTML = htmlContent.join("");
    calculateTotalAmount();
}

function deleteProduct(SrId) {
    console.log(SrId);
    htmlContent[SrId] = "";
    // htmlContent = htmlContent.filter(product => product.id !== SrId);
    productList = productList.filter(product => product.indexId !== SrId);
    updateProductList();
    calculateTotalAmount();
}

overallDiscount.addEventListener('keyup', function () {
    calculateTotalAmount();
})

// saveBtn.addEventListener('click', function() {
//     const data = { productList: JSON.stringify(productList) }; // Convert array to JSON string
//     const urlEncodedData = new URLSearchParams(data).toString();

//     fetch('insertProduct.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: urlEncodedData
//     })
//     .then(response => response.text())
//     .then(result => {
//         console.log(result);
//         if (result === 'success') {
//             alert("Products saved successfully!");
//         } else {
//             alert("Failed to save products.");
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert("An error occurred.");
//     });
// });



function getCurrentDate() {
    var today = new Date();
    var day = today.getDate().toString().padStart(2, '0');  // Ensure day is always 2 digits
    var month = (today.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed
    var year = today.getFullYear();

    return day + '/' + month + '/' + year;
}



function savePurchaseDetails() {
    if (!currentSellerId) {
        alert('Please select a seller.');
        return;
    }

    let bill_no = billNoTF.value;
    if (bill_no === "") {
        alert('Please enter the Bill No.');
        return;
    }

    let date = document.getElementById('purchaseBillDateInput').value;
    if (!date) {
        alert('Please enter the Bill Date');
    }

    let purchaseDetails = {
        date: date,
        seller_id: currentSellerId,
        bill_no: bill_no,
        discount: overallDiscount.value,
        amount: purchaseTotalAmount,
    };

    console.log(purchaseDetails);

    const data = { purchaseDetails: JSON.stringify(purchaseDetails) };
    const urlEncodedData = new URLSearchParams(data).toString();

    fetch('savePurchaseDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {
            if (result) {
                alert("Purchase details saved successfully!" + Number(result));
                insertProducts(Number(result));

            } else {
                alert("Failed to save purchase details.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while saving the purchase details.");
        });
}

saveBtn.addEventListener('click', savePurchaseDetails);

function insertProducts(id) {

    if (productList.length === 0) {
        alert('No products added to the list!');
        return;
    }


    const data = {
        purchase_id: id,
        productList: JSON.stringify(productList)  
    };

    fetch('insertProduct.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    })
    .then(response => response.text())
    .then(result => {
        if(result){
            updateProductListTable(id);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving the product list.');
    });

}


function updateProductListTable(id){
    const purchaseId = id;

    fetch('updateProductListTable.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'purchase_id': purchaseId
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

}