let cart = [];
let totalprice=0;
let totalquantity=0;
let cusid;
let items = [];
let orderobj = {
    customer: '',
    items,
 };

$(document).ready(function() {
    get.forEach(element => {
        $(`#btn-${element.id}`).click(function(e) {
            e.preventDefault();
            if($(`#inp-${element.id}`).val()<0 || $(`#inp-${element.id}`).val()>20) {
                alert('Items Should be between 1-20');
                return;
            }
            let found=false;
            cart.every(function(x,index) {
                if(x.item==element.id) {
                    cart[index] = {...x,
                        quantity: $(`#inp-${element.id}`).val(),
                        price: $(`#inp-${element.id}`).val()*element.price };
                        found=Boolean(true);
                        return false;     
                }
                return true;
            });
            if(found==false) {
                cart.push({
                    name: element.name,
                    item: element.id,
                    quantity: +$(`#inp-${element.id}`).val(),
                    price: $(`#inp-${element.id}`).val()*element.price
                })
            };
            $('.tempbill').css({"display": "block"});
        })
    });
});

$('#fetchbill').click(function(e) {
    e.preventDefault();
    totalprice=0;
    totalquantity=0;
    orderobj = { };
    items = [];
    orderobj.customer=cusid;

    let content = `<br>
    <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                </tr>
            </thead>
        <tbody>`;
    cart.forEach(e=>{
        if(e.price) {
            items.push({
                item: e.item,
                quantity: e.quantity,
                price: e.price
            });
       content+=`
            <tr>
                <td>
                    ${e.name}
                </td>
                <td>
                    ${e.quantity}
                </td>
                <td>
                    ${e.price} Rs
                </td> 
            </tr>`;
        totalprice += e.price;
        totalquantity += +e.quantity;
        }
    });
    content+=`
        <tr>
            <td>
               Grand total
            </td>
            <td>
                ${totalquantity}
            </td>
            <td>
                ${totalprice} Rs
            </td>
        </tr>           
    `;
    $(`#bill-div`).html(content);
    
    orderobj.items=items;
    orderobj.total=totalprice;
    orderobj.count=totalquantity;
    $("#place-order").css("display", "block");
});

let createUser = function(){
    let newForm = $('#addcustform');
    newForm.submit(function(e){
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/add-customer', 
            data: newForm.serialize(),
            success: function(data){
                cusid = data.data.customer._id;
                new Noty({
                    theme: 'relax',
                    text: "Details Saved!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

            }, error: function(error){
                console.log(error.responseText);
            }
        });
        $('.select-items').css("display", "block");
    });
}
createUser();

let placeOrder = function(){
    let pOrder = $('#place-order');
    pOrder.click(function(e){
        // window.location.replace("/dashboard");
        $.ajax({
            type: 'post',
            url: '/place-order',
            data: orderobj,
            success: function(data) {
                new Noty({
                    theme: 'relax',
                    text: "Order Placed!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500                    
                }).show();
                // location.reload();
            }, error: function(error){
                console.log(error.responseText);
            }
        });
       
    });
}
placeOrder();