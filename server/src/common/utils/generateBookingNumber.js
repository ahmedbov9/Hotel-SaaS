
module.exports = function generateBookingNumber() {
    const now = Date.now().toString().slice(-6);
    const random = Math.floor(1000  + Math.random() * 9000);
    return `BK-${now}-${random}`;
}