import api from './api';

export const getDashboardStats = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const endpoint = `/admin/dashboard/stats${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw error;
  }
};

export const getConsultationData = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const endpoint = `/admin/dashboard/consultations${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Consultation data error:', error);
    throw error;
  }
};

export const getPrescriptionData = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const endpoint = `/admin/dashboard/prescriptions${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Prescription data error:', error);
    throw error;
  }
};

export const getActiveData = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const endpoint = `/admin/dashboard/active${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Active data error:', error);
    throw error;
  }
};

export const getRecentPatients = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const endpoint = `/admin/patients${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Recent patients error:', error);
    throw error;
  }
};

export const getSpecialtiesData = async () => {
  try {
    const endpoint = '/admin/dashboard/specialties';
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    console.error('Specialties data error:', error);
    throw error;
  }
};

