const resultDiv = document.getElementById('productSearchResult');
const productSearch = document.getElementById('productSearchBox');
const productList=document.getElementById("productList");

const saveBtn=document.getElementById('saveBtn');

const popUpAddBtn=document.getElementById('addBtn');
const popUpCancelBtn=document.getElementById('cancelBtn');

const popUpProductName=document.getElementById('popUpProductName');
const batchNo=document.getElementById('popUpBatch');
const qty=document.getElementById('popUpQty');
const availableQty=document.getElementById('availableQty');
const expiry=document.getElementById('popUpExpiry');
const gst=document.getElementById('popUpGST');
const discount=document.getElementById('popUpDiscount');
const price=document.getElementById('popUpPrice');
const finalBillAmount=document.getElementById('amount');
const billNetAmount=document.getElementById('netAmount');
const popUp=document.getElementById('productEditPopUp');
const overallDiscountField=document.getElementById('overallDiscount');

let currentInvoiceNumber;

let addedProducts=[];
let currentProductId;
let currentProductName;
let currentBatchId;
let overallDiscount=0;

let totalBillNetAmount=0;

let htmlContent = [];
let index=0;



function getCurrentDate() {
    var today = new Date();
    var day = today.getDate().toString().padStart(2, '0');  
    var month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    var year = today.getFullYear();

    return day + '/' + month + '/' + year;
}

function loadPageDetails(){
    document.getElementById('date').innerHTML=getCurrentDate();

fetch('getInvoiceNo.php', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})
.then(response => response.text())
.then(data => {
    console.log(data); 
    document.getElementById('invoiceNo').innerText = data;
    currentInvoiceNumber=data;
})
.catch(error => {
    console.error('Error:', error);
});

}

function updateProductList(){
    productList.innerHTML=htmlContent.join('');
}

let productNameHint="";
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
    if(productNameHint===""){
        resultDiv.innerHTML="";
        return;
    }
    const content = productNameHint.map(item => {
        return `<li onclick="getProductDetail('${item.id}', '${item.name}')">${item.name}</li>`;
    }).join("");

    resultDiv.innerHTML = `<ul>${content}</ul>`;
}

/////////////////////////////////////////////////////////////////////////////////

let productDetails="";

function getProductDetail(pid,pname) {
    currentProductId=pid;
    currentProductName=pname;
    popUpProductName.innerHTML=currentProductName;
    const data = { productId: pid };
    const urlEncodedData = new URLSearchParams(data).toString();

    fetch('getProductData.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(productInfo => {
            
            productDetails = JSON.parse(productInfo); // Parse response as JSON
            displayProductPopUpBatch();

        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function displayProductPopUpBatch(){
    
    popUpCancelBtn.style.display="block";

    popUp.classList.remove('editPopUpHidden');
    const batch_Element=document.getElementById('popUpBatch');
    const defaultOption = `<option value="x">Select batch</option>`;
    const content = productDetails.map(batch => {
        return `<option value="${batch.batch_id}">${batch.batch_no}</option>`;
    }).join("");

    batch_Element.innerHTML=defaultOption+content;

    batch_Element.onchange=function(){
        displayProductPopUpDetails(this.value);
    }
}


function displayProductPopUpDetails(selected_batch_id) {

    currentBatchId=selected_batch_id;

    const currentProduct = productDetails.find(product => product.batch_id === selected_batch_id);

    if (!currentProduct) {

    } else {
        availableQty.innerHTML=' / '+currentProduct.quantity;
        expiry.value=currentProduct.expiry;
        gst.value='  '+currentProduct.gst+' %';
        discount.value='';
        price.value=currentProduct.price;
    }
}

function displayEditProductPopUpDetails(editProduct) {
    popUpCancelBtn.style.display="none";
    const batch_Element=document.getElementById('popUpBatch');

    console.log(editProduct);
    if (!editProduct) {
        console.log("Hello");
    } else {
        batch_Element.innerHTML=`<option value="${editProduct.batch_id}">${editProduct.batch_no}</option>`;
        console.log(editProduct.batch_no);
        qty.value=editProduct.quantity;
        availableQty.innerHTML=' / '+editProduct.availableQty;
        expiry.value=editProduct.expiry;
        gst.value=editProduct.gst;
        discount.value=editProduct.discount;
        price.value=editProduct.price;
    }
    return;
}


productSearch.onkeyup = function(event) {
    if(productSearch.value===""){
        displayProductHint("");
    }
    else{
        getHintData(productSearch.value)
    }
};

/////////////////////////////////////////////////////////


popUpAddBtn.addEventListener('click', function() {
    const batchValueIndex=batchNo.options[batchNo.selectedIndex];
    const batchValue=batchValueIndex.text;
    const qtyValue=qty.value;
    const availableQtyValue=availableQty.innerText.slice(2);
    console.log(availableQtyValue);
    const expiryValue=expiry.value;
    const gstValue=gst.value;
    const priceValue=price.value;
    const discountValue=discount.value;

    if(qtyValue==="" || expiryValue==="" || gstValue==="" || priceValue===""){
        alert("Fields Cannot be Empty");
    }
    else{
       
        let totalAmount;
        totalAmount=Number(qtyValue)*Number(priceValue);
        totalAmount-=(totalAmount*Number(discountValue)/100);

        let y={id:index,content:`
        <div class="productList" >
                    <div class="productNameDiv">
                        <h4 class="productName productListText">${currentProductName}</h4>
                        <h5 class="productLabel productListLabel">Product</h5>
                    </div>
                    <div class="productBatchDiv">
                        <h4 class="productListText">${batchValue}</h4>
                     <h5 class="productListLabel">Batch</h5>
                    </div>
                    <div class="productExpiryDiv">
                        <h4 class="productListText">${expiryValue}</h4>
                        <h5 class="productListLabel">Expiry</h5>
                    </div>
                    <div class="productQuantityDiv">
                        <h4 class="productListText">${qtyValue}</h4>
                        <h5 class="productListLabel">Quantity</h5>
                    </div>
                    <div class="productPriceDiv">
                        <h4 class="productListText">${priceValue}</h4>
                        <h5 class="productListLabel">Price</h5>
                    </div>
                    <div class="productDiscountDiv">
                        <h4 class="productListText">${discountValue}</h4>
                        <h5 class="productListLabel">Discount</h5>
                    </div>
                    <div class="productAmountDiv">
                        <h4 class="productListText">${totalAmount}</h4>
                        <h5 class="productListLabel">Amount</h5>
                    </div>
                    <div class="productEditDiv">
                        <img src="Resources/Images/Icons/edit.svg" alt="edit" class="editIcon productEditIcons" onclick="editProduct(${index})">
                        <img src="Resources/Images/Icons/delete.svg" alt="delete" class="deleteIcon productEditIcons" onclick="deleteProduct(${index})">
                    </div>
                </div>

            `};

            htmlContent.push(y.content);
            updateProductList();

     let temp={indexId: index, product_id:currentProductId, product_name: currentProductName, batch_id:currentBatchId, batch_no:batchValue, quantity:qtyValue, availableQty:availableQtyValue, expiry:expiryValue, gst:gstValue, price:priceValue, discount:discountValue, amount:totalAmount}
     addedProducts.push(temp);
     index++;
     calculateTotal();

     //s
     qty.value="";
     availableQty.innerHTML="";
     expiry.value="";
     gst.value="";
     discount.value="";
     price.value="";
     resultDiv.innerHTML="";
     document.getElementById('productSearchBox').value='';
     popUp.classList.add('editPopUpHidden');

    }
});

popUpCancelBtn.addEventListener('click', function(){
    qty.value=""
    availableQty.innerHTML='';
    expiry.value="";
    gst.value="";
    discount.value="";
    price.value="";
    popUp.classList.add('editPopUpHidden');
});

function calculateTotal(){
    let z=0;
    for(let i=0;i<addedProducts.length;i++){
        z+=Number(addedProducts[i].amount);
    }
    z-=Number(z*overallDiscount/100);
    finalBillAmount.innerHTML=z;
    let roundVal=Math.round(z);
    billNetAmount.innerText=roundVal;
    totalBillNetAmount=roundVal;
    if((roundVal-z) >0){
        document.getElementById('tfOtherAddition').value=roundVal-z;
    }
    else{
        document.getElementById('tfOtherDeduction').value=Math.abs(roundVal-z);
    }
}

overallDiscountField.addEventListener('keyup', function(){
    overallDiscount=overallDiscountField.value;
    calculateTotal();
}
)

function editProduct(SrId){
    console.log(SrId);
    let p = addedProducts.find(product => product.indexId === Number(SrId));
    // console.log(p);
    popUp.classList.remove('editPopUpHidden');
    currentProductName=p.product_name;
    popUpProductName.innerHTML=currentProductName;

    displayEditProductPopUpDetails(p);
    deleteProduct(SrId);
}
function deleteProduct(SrId){
    console.log(SrId);
    htmlContent[SrId]="";
    addedProducts = addedProducts.filter(product => product.indexId !== SrId);
    updateProductList();
    calculateTotal();
}

function addInvoice(){
    let paymentType;
    let cash=0;
    let upi=0;
    let card=0;
    if(document.getElementById('paymentType').value==='CASH'){
        paymentType='CASH';
        cash=totalBillNetAmount;
    }
    else if(document.getElementById('paymentType').value==='UPI'){
        paymentType='UPI';
        upi=totalBillNetAmount;
    }
    else if(document.getElementById('paymentType').value==='CARD'){
        paymentType='CARD';
        card=totalBillNetAmount;
    }
    else{
        paymentType='SPLIT';
        cash=document.getElementById('cashSplit').value;
        upi=document.getElementById('upiSplit').value;
    }
    let date=getCurrentDate();
    let invoiceDetails = {
        invoice_date:date,
        invoice_discount: overallDiscount,
        payment_type: paymentType,
        cash: cash,
        upi: upi,
        imvoice_addition: document.getElementById('tfOtherAddition').value,
        imvoice_deduction: document.getElementById('tfOtherDeduction').value,
        invoice_total_amount: totalBillNetAmount,
        card: card,
    };

    const data = { invoiceDetails: JSON.stringify(invoiceDetails) };
    const urlEncodedData = new URLSearchParams(data).toString();

    fetch('saveInvoiceDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {
            if (result) {
                alert("Invoice details saved successfully!");
                console.log(result);
                addInvoiceProducts(Number(result));

            } else {
                alert("Failed to save purchase details.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while saving the purchase details.");
        });
}
function addInvoiceProducts(id){
    if (addedProducts.length === 0) {
        alert('No products added to the list!');
        return;
    }


    const data = {
        invoice_id: Number(id),
        productList: JSON.stringify(addedProducts)  
    };

    fetch('addInvoiceProducts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    })
    .then(response => response.text())
    .then(result => {
        if(result){
            console.log(result);            
        }
        location.reload();

    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving the product list.');
    });
}

function saveMainFunction(){

    if (addedProducts.length === 0) {
        alert('No products added to the list!');
        return;
    }


    const data = {
        productList: JSON.stringify(addedProducts)  
    };

    fetch('updateProductQty.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    })
    .then(response => response.text())
    .then(result => {
        if(result){
            console.log(result);
            if(result==='success'){
                addInvoice();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving the product list.');
    });
}

saveBtn.addEventListener('click' , saveMainFunction);
