// Serviço de Upload - Nhost Storage

import nhost from '../lib/nhost.js';

const BUCKET_ID = 'os-arquivos'; // Nome do bucket no Nhost Storage

export const uploadService = {
  /**
   * Fazer upload de arquivo para Nhost Storage
   */
  async upload(file) {
    try {
      const { data, error } = await nhost.storage.upload({
        bucketId: BUCKET_ID,
        file,
        filename: `${Date.now()}-${file.name}`
      });

      if (error) throw error;

      // Retornar URL pública do arquivo
      const url = nhost.storage.getPublicUrl({
        bucketId: BUCKET_ID,
        fileId: data.id
      });

      return {
        success: true,
        id: data.id,
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        url
      };
    } catch (error) {
      console.error('Erro no upload:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fazer upload de múltiplos arquivos
   */
  async uploadMultiple(files) {
    const results = [];
    
    for (const file of files) {
      const result = await this.upload(file);
      results.push(result);
    }

    return results.filter(r => r.success);
  },

  /**
   * Obter URL pública de um arquivo
   */
  getPublicUrl(fileId) {
    return nhost.storage.getPublicUrl({
      bucketId: BUCKET_ID,
      fileId
    });
  },

  /**
   * Deletar arquivo
   */
  async delete(fileId) {
    try {
      const { error } = await nhost.storage.remove({
        bucketId: BUCKET_ID,
        fileId
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return { success: false, error: error.message };
    }
  }
};
