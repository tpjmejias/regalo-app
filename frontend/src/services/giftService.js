const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const giftService = {
  // Obtener lista de regalos
  getGifts: async (phone) => {
    const response = await fetch(`${API_URL}/gifts/${phone}`);
    if (!response.ok) throw new Error('Error al obtener regalos');
    return response.json();
  },

  // Crear nuevo regalo
  createGift: async (giftData) => {
    const response = await fetch(`${API_URL}/gifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(giftData),
    });
    if (!response.ok) throw new Error('Error al crear regalo');
    return response.json();
  },

  // Actualizar regalo
  updateGift: async (phone, giftId, giftData) => {
    const response = await fetch(`${API_URL}/gifts/${phone}/${giftId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(giftData),
    });
    if (!response.ok) throw new Error('Error al actualizar regalo');
    return response.json();
  },

  // Eliminar regalo
  deleteGift: async (phone, giftId) => {
    const response = await fetch(`${API_URL}/gifts/${phone}/${giftId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar regalo');
    return response.json();
  },

  // Actualizar visibilidad de la lista
  updateListVisibility: async (phone, isPublic) => {
    const response = await fetch(`${API_URL}/gifts/${phone}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPublic }),
    });
    if (!response.ok) throw new Error('Error al actualizar visibilidad');
    return response.json();
  }
}; 