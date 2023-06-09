enum PaymentTypeEnum {
    None = 0,
    Checkout = 1,
    PayTM = 2,
    SMBCLink = 3,
    Stripe = 4,
    StripeConnect = 5,
    DGPay = 6,
    Tuna = 7,
    MasterPass = 8,
    PayPay = 9,
    Moyasar = 10,
    CheckoutPlatform = 11,
    Maf = 12,
    Ticket = 13,
    IndiaGooglePayDirect = 14,
    Vostro = 15,
    Tapp = 16,
    Mypaymentgateway = 17
}
const PaymentTypeName: {
    [key: number]: string;
} = {
    [PaymentTypeEnum.None]: 'None',
    [PaymentTypeEnum.Checkout]: 'Checkout',
    [PaymentTypeEnum.PayTM]: 'PayTM',
    [PaymentTypeEnum.SMBCLink]: 'SMBCLink',
    [PaymentTypeEnum.Stripe]: 'Stripe',
    [PaymentTypeEnum.StripeConnect]: 'StripeConnect',
    [PaymentTypeEnum.DGPay]: 'DGPay',
    [PaymentTypeEnum.Tuna]: 'Tuna',
    [PaymentTypeEnum.MasterPass]: 'MasterPass',
    [PaymentTypeEnum.PayPay]: 'PayPay',
    [PaymentTypeEnum.Moyasar]: 'Moyasar',
    [PaymentTypeEnum.CheckoutPlatform]: 'CheckoutPlatform',
    [PaymentTypeEnum.Maf]: 'Maf',
    [PaymentTypeEnum.Ticket]: 'Ticket',
    [PaymentTypeEnum.IndiaGooglePayDirect]: 'IndiaGooglePayDirect',
    [PaymentTypeEnum.Vostro]: 'Vostro',
    [PaymentTypeEnum.Tapp]: 'Tapp',
    [PaymentTypeEnum.Mypaymentgateway]: 'Mypaymentgateway'
}
