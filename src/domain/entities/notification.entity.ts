export interface NotificationEntity {
  id: number;
  user_id: number; // Usuario que recibe la notificación
  type: 'like' | 'comment' | 'reply'; // Tipo de notificación
  story_id: number; // Cuento relacionado
  triggered_by_user_id: number; // Usuario que causó la notificación
  comment_id?: number; // ID del comentario (opcional, solo para comments/replies)
  is_read: boolean; // Si la notificación fue leída
  created_at: Date;
}
