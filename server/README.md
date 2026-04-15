OST /api/products

Body (JSON):
{
  "name": "Nike Air Max",
  "price": 150,
  "quantity": 10,
  "size": "42"
}

Response:
{
  "message": "Maxsulot qo'shildi ✅",
  "product": {
    "id": 1,
    "name": "Nike Air Max",
    "price": 150,
    "quantity": 10,
    "size": "42",
    "status": "available"
  }
}

📋 Hamma maxsulotlarni olish

GET /api/products

Response:
[
  {
    "id": 1,
    "name": "Nike Air Max",
    "price": 150,
    "quantity": 10,
    "size": "42",
    "status": "available"
  }
]

❌ Maxsulotni o‘chirish

DELETE /api/products/:id

Example:
DELETE /api/products/1

Response:
{
  "message": "Maxsulot o‘chirildi ❌",
  "result": {
    "deletedID": 1
  }
}

✅ Sotildi deb belgilash

PUT /api/products/:id/sell

Example:
PUT /api/products/1/sell

Response:
{
  "message": "Maxsulot sotildi ✅",
  "result": {
    "updatedID": 1,
    "status": "sold"
  }
}

🔄 Qaytarildi deb belgilash

PUT /api/products/:id/return

Example:
PUT /api/products/1/return

Response:
{
  "message": "Maxsulot qaytarildi 🔄",
  "result": {
    "updatedID": 1,
    "status": "returned"
  }
}

🛍️ Sotilgan maxsulotlarni olish

GET /api/products/sold

Response:
[
  {
    "id": 2,
    "name": "Adidas Superstar",
    "price": 120,
    "quantity": 5,
    "size": "41",
    "status": "sold"
  }
]

📦 Qaytarilgan maxsulotlarni olish

GET /api/products/returned

Response:
[
  {
    "id": 3,
    "name": "Puma Suede",
    "price": 100,
    "quantity": 2,
    "size": "40",
    "status": "returned"
  }
]

🛠️ Tools

Node.js

Express.js

SQLite3
