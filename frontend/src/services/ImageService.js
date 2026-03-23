import api from './api';

const ImageService = {
    upload: async (packageId, file, altText, isPrimary) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', altText);
        formData.append('isPrimary', isPrimary);

        return api.post(`/images/upload/${packageId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    getByPackage: async (packageId) => {
        return api.get(`/images/package/${packageId}`);
    },

    delete: async (id) => {
        return api.delete(`/images/${id}`);
    }
};

export default ImageService;
