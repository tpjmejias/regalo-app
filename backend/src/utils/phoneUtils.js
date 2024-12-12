/**
 * Limpia un número de teléfono eliminando todos los caracteres no numéricos
 * @param {string} phone - Número de teléfono con o sin formato
 * @returns {string} Número de teléfono limpio (solo dígitos)
 */
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

module.exports = {
  cleanPhoneNumber
}; 