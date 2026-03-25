import { Mentoria } from '../types/mentorias.types';

class MentoriasService {
  private mockMentorias: Mentoria[] = [
    {
      id: '1',
      title: 'Mentoria de Liderança Tech',
      description: 'Desenvolvimento de habilidades de liderança para engenheiros de software.',
      status: 'active',
      version: '1.0.2',
      type: 'Carreira',
      lastUpdate: '2026-03-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Arquitetura de Sistemas Escaláveis',
      description: 'Aprofundamento em padrões de arquitetura e escalabilidade.',
      status: 'draft',
      version: '0.9.0',
      type: 'Técnica',
      lastUpdate: '2026-03-24T15:30:00Z',
    },
    {
      id: '3',
      title: 'Product Discovery Masterclass',
      description: 'Metodologias modernas de descoberta de produto.',
      status: 'active',
      version: '2.1.0',
      type: 'Produto',
      lastUpdate: '2026-03-15T09:00:00Z',
    }
  ];

  async getMentorias(): Promise<Mentoria[]> {
    // Simular chamada de API/Supabase
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockMentorias), 500);
    });
  }

  async getMentoriaById(id: string): Promise<Mentoria | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockMentorias.find(m => m.id === id)), 300);
    });
  }

  // Métodos futuros para Supabase Storage
  async uploadMaterial(mentoriaId: string, file: File): Promise<string> {
    console.log(`Uploading ${file.name} for mentoria ${mentoriaId}`);
    return 'url-placeholder';
  }
}

export const mentoriasService = new MentoriasService();
