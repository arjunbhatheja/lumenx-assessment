import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      this.reconnectAttempts = 0;
      
      // Join user/role rooms if user is logged in
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        const userData = JSON.parse(user);
        this.socket?.emit('join', {
          userId: userData.id,
          role: userData.role || 'user'
        });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Post-related events
  onPostCreated(callback: (post: any) => void): void {
    this.socket?.on('post:new', callback);
  }

  onPostUpdated(callback: (post: any) => void): void {
    this.socket?.on('post:updated', callback);
  }

  onPostDeleted(callback: (data: { id: number }) => void): void {
    this.socket?.on('post:deleted', callback);
  }

  // Admin events
  onAdminNotification(callback: (notification: any) => void): void {
    this.socket?.on('admin:notification', callback);
  }

  onUserActivity(callback: (activity: any) => void): void {
    this.socket?.on('user:activity', callback);
  }

  // Emit events
  emitPostCreated(post: any): void {
    this.socket?.emit('post:created', post);
  }

  emitPostUpdated(post: any): void {
    this.socket?.emit('post:updated', post);
  }

  emitPostDeleted(postId: number): void {
    this.socket?.emit('post:deleted', postId);
  }

  emitUserActivity(activity: { userId: number; action: string; timestamp: string }): void {
    this.socket?.emit('user:activity', activity);
  }

  emitAdminNotify(notification: any): void {
    this.socket?.emit('admin:notify', notification);
  }

  // Remove specific event listeners
  offPostCreated(): void {
    this.socket?.off('post:new');
  }

  offPostUpdated(): void {
    this.socket?.off('post:updated');
  }

  offPostDeleted(): void {
    this.socket?.off('post:deleted');
  }

  offAdminNotification(): void {
    this.socket?.off('admin:notification');
  }

  offUserActivity(): void {
    this.socket?.off('user:activity');
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
