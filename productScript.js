//----------------------ADD PRODUCT------------------------//
const addProductName=document.getElementById('productAddNameInput');
const addProductCompany=document.getElementById('productAddCompanyInput');
const addProductClassification=document.getElementById('productAddClassificationInput');
const addProductRack=document.getElementById('productAddRackInput');
const addProductComment=document.getElementById('productAddCommentInput');
const addProductClearBtn=document.getElementById('addClearBtn');
const addProductSaveBtn=document.getElementById('addSaveBtn');
const addProductCompanyHint=document.getElementById('addCompanySearchResult');
const addProductClassificationHint=document.getElementById('addClassificationSearchResult');

let nameResult;
let companyResult;
let classificationResult;

function addProductDB(data) {

    const urlEncodedData = new URLSearchParams(data).toString();
    fetch('addProduct.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            addProductStatus = result;
            console.log(result);
            clearAddProduct();

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addProduct(){
    let productName=addProductName.value.toUpperCase();
    let productCompany=addProductCompany.value.toUpperCase();
    let productClassification=addProductClassification.value.toUpperCase();
    let productRack=addProductRack.value.toUpperCase();
    let productComment=addProductComment.value.toUpperCase();
    if(productName==="" || productCompany==="" || productClassification==""){
        alert("Fields Cannot be Empty");
        return;
    }
    let temp={name:productName, company:productCompany, classification:productClassification, rack:productRack, comment:productComment};
    addProductDB(temp);
    console.log(temp);
}
function clearAddProduct(){
    addProductName.value="";
    addProductCompany.value="";
    addProductClassification.value="";
    addProductRack.value="";
    addProductComment.value="";
}

function displayAddCompanyHint(){
    if(companyResult===""){
        addProductCompanyHint.innerHTML="";
        return;
    }
    const content = companyResult.map(item => {
        return `<li onclick="addProductCompany.value='${item.product_company}'; addProductCompanyHint.innerHTML='' ">${item.product_company}</li>`;
    }).join("");

    addProductCompanyHint.innerHTML = `<ul>${content}</ul>`;
}
function displayAddClassificationHint(){
    if(classificationResult===""){
        addProductClassificationHint.innerHTML="";
        return;
    }
    const content = classificationResult.map(item => {
        return `<li onclick="addProductClassification.value='${item.product_classification}'; addProductClassificationHint.innerHTML='' ">${item.product_classification}</li>`;
    }).join("");

    addProductClassificationHint.innerHTML = `<ul>${content}</ul>`;
}

function companyHint(textField,x){
    let data={text:textField.value};

    const urlEncodedData = new URLSearchParams(data).toString();
    fetch('productCompanyHints.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            companyResult = JSON.parse(result);
            if(x==='add'){
                displayAddCompanyHint();
            }
            return;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function classificationHint(textField){
    let data={text:textField.value};

    const urlEncodedData = new URLSearchParams(data).toString();
    fetch('productClassificationHint.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            classificationResult = JSON.parse(result);
            displayAddClassificationHint();
            console.log(result);
            return;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

addProductSaveBtn.addEventListener('click',addProduct);
addProductClearBtn.addEventListener('click', clearAddProduct);
addProductCompany.addEventListener('keyup', function(){
    if(addProductCompany.value===""){
        addProductCompanyHint.innerHTML = "";
    }
    else{
        companyHint(this,'add');
    }
});
addProductClassification.addEventListener('keyup', function(){
    if(addProductClassification.value===""){
        addProductClassificationHint.innerHTML = "";
    }
    else{
        console.log("Hello");   
        classificationHint(this);
    }
});

//----------------------EDIT PRODUCT------------------------//

