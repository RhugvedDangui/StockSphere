const editProductName=document.getElementById('productEditNameInput');
const editProductCompany=document.getElementById('productEditCompanyInput');
const editProductClassification=document.getElementById('productEditClassificationInput');
const editProductRack=document.getElementById('productEditRackInput');
const editProductComment=document.getElementById('productEditCommentInput');

const editProductNameHint=document.getElementById('editProductSearchResultDiv');

let editDetails;
let nameResult=[];

function displayEditProductHint(){
    if(nameResult===""){
        editProductNameHint.innerHTML="";
        return;
    } 
    const content = nameResult.map(item => {
        return `<li onclick="editProductName.value='${item.product_name}'; productEditDetails(${item.product_id}, '${item.product_name}'); editProductNameHint.innerHTML='' ">${item.product_name}</li>`;   //;
    }).join("");

    editProductNameHint.innerHTML = `<ul>${content}</ul>`;
}

function productHint(textField,x){
    let data={text:textField.value};
    const urlEncodedData = new URLSearchParams(data).toString();
    fetch('productNameHint.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            nameResult = JSON.parse(result);
            if(x==='add'){
                displayAddCompanyHint();
            }else{
                displayEditProductHint();
                console.log(result);
            }
            return;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function productEditDetails(productId,productName){
    let data={id:productId, name:productName};
    const urlEncodedData = new URLSearchParams(data).toString();
    fetch('productEditDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            editDetails = JSON.parse(result);
            displayEditProductDetails(editDetails);
            return;

        })
        .catch(error => {
            console.error('Error:', error);
        });
    
}

function displayEditProductDetails(details){
    console.log(details);
    editProductCompany.value=details.product_company;
    editProductClassification.value=details.product_classification;
    editProductRack.value=details.product_rack;
    editProductComment.value=details.product_comment;
    getProductsList(details.product_id);
}

function getProductsList(pId){
    let data={id:pId};
    const urlEncodedData = new URLSearchParams(data).toString();
    fetch('productEditDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {

            let prodList = JSON.parse(result);
            console.log(prodList);
            return;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// editProductName.addEventListener('keyup',function(){
//     if(editProductName.value===""){
//         console.log("Hello");
//         editProductNameHint.innerHTML="";
//     }
//     else{
//         productHint(this,'edit');
//     }
// })