"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderItem = void 0;
class OrderItem {
    id;
    productId;
    quantity;
    unitPrice;
    addedIngredients;
}
exports.OrderItem = OrderItem;
class Order {
    id;
    ticketId;
    type;
    date;
    customerId;
    items;
    total;
    status;
}
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map