const addSellerBtn=document.getElementById('addSellerBtn');
const sellerName=document.getElementById('sellerNameInput');
const sellerPhone=document.getElementById('sellerPhoneInput');
const sellerAddress=document.getElementById('sellerAddressInput');
function addSeller(){
    let sellerDetails = {
       sellerName:sellerName.value,
       sellerPhone:sellerPhone.value,
       sellerAddress:sellerAddress.value
    };

    const data = { invoiceDetails: JSON.stringify(sellerDetails) };
    const urlEncodedData = new URLSearchParams(data).toString();

    fetch('addSeller.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
        .then(response => response.text())
        .then(result => {
            if (result) {
                alert("Seller details saved successfully!");
                console.log(result);
                clearFields();
            } else {
                alert("Failed to save purchase details.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while saving the purchase details.");
        });
}
function clearFields(){
    sellerName.value="";
    sellerPhone.value="";
    sellerAddress.value="";
}

addSellerBtn.addEventListener('click',addSeller);