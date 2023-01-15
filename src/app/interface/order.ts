export interface Order {
    id : number,
    name : string
    state : string
    zip : number
    amount : number
    quantity : number
    item : string
}

export const MOCK_ORDER = {
    ststus_code : 200,
    response : [
        {
            "id": "1",
            "name": "Nike Shoe",
            "state": "Karnataka",
            "zip": "560093",
            "amount": "15000",
            "quantity": "4",
            "item": "AAH6748"
        }
    ]
}