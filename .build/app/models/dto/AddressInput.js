"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileInput = exports.ShippingAddressInput = exports.BillingAddressInput = exports.AddressInput = void 0;
const class_validator_1 = require("class-validator");
class AddressInput {
}
exports.AddressInput = AddressInput;
__decorate([
    (0, class_validator_1.Length)(3, 32),
    __metadata("design:type", String)
], AddressInput.prototype, "addressLine1", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 12),
    __metadata("design:type", String)
], AddressInput.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], AddressInput.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.Length)(4, 6),
    __metadata("design:type", String)
], AddressInput.prototype, "post_code", void 0);
__decorate([
    (0, class_validator_1.Length)(2, 3),
    __metadata("design:type", String)
], AddressInput.prototype, "country", void 0);
class BillingAddressInput {
}
exports.BillingAddressInput = BillingAddressInput;
__decorate([
    (0, class_validator_1.Length)(3, 32),
    __metadata("design:type", String)
], BillingAddressInput.prototype, "addressLine1", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], BillingAddressInput.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], BillingAddressInput.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.Length)(4, 6),
    __metadata("design:type", String)
], BillingAddressInput.prototype, "post_code", void 0);
__decorate([
    (0, class_validator_1.Length)(2, 3),
    __metadata("design:type", String)
], BillingAddressInput.prototype, "country", void 0);
class ShippingAddressInput {
}
exports.ShippingAddressInput = ShippingAddressInput;
__decorate([
    (0, class_validator_1.Length)(3, 32),
    __metadata("design:type", String)
], ShippingAddressInput.prototype, "addressLine1", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], ShippingAddressInput.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], ShippingAddressInput.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.Length)(4, 6),
    __metadata("design:type", String)
], ShippingAddressInput.prototype, "post_code", void 0);
__decorate([
    (0, class_validator_1.Length)(2, 3),
    __metadata("design:type", String)
], ShippingAddressInput.prototype, "country", void 0);
class ProfileInput {
}
exports.ProfileInput = ProfileInput;
__decorate([
    (0, class_validator_1.Length)(3, 32),
    __metadata("design:type", String)
], ProfileInput.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 32),
    __metadata("design:type", String)
], ProfileInput.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.Length)(2, 32),
    __metadata("design:type", String)
], ProfileInput.prototype, "middle_name", void 0);
__decorate([
    (0, class_validator_1.Length)(10, 20),
    __metadata("design:type", String)
], ProfileInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(8, 50),
    __metadata("design:type", String)
], ProfileInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(8, 16),
    __metadata("design:type", String)
], ProfileInput.prototype, "password", void 0);
//# sourceMappingURL=AddressInput.js.map