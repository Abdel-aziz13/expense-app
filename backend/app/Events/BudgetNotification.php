<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement de notification de budget
 * 
 * Cet événement est déclenché lorsqu'une action sur le budget nécessite
 * une notification en temps réel à l'utilisateur
 */
class BudgetNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Les données de notification
     *
     * @var array
     */
    public array $data;

    /**
     * Créer une nouvelle instance de l'événement
     *
     * @param array $data Les données de notification
     */
    public function __construct(array $data)
    {
        $this->data = array_merge([
            'timestamp' => now()->toISOString(),
            'type' => 'budget_notification'
        ], $data);

        // Sauvegarder en base si user_id existe
        if (isset($this->data['user_id'])) {
            Notification::create([
                'user_id' => $this->data['user_id'],
                'type' => $this->data['type'],
                'message' => $this->data['message'] ?? $this->data['data'] ?? '',
            ]);
        }
    }

    /**
     * Obtenir les canaux sur lesquels l'événement doit être diffusé
     *
     * @return Channel|PrivateChannel
     */
    public function broadcastOn(): Channel|PrivateChannel
    {
        // Utiliser un canal privé si l'utilisateur est spécifié
        if (isset($this->data['user_id'])) {
            return new PrivateChannel('budget.notifications.' . $this->data['user_id']);
        }

        // Canal public par défaut
        return new PrivateChannel('budget.notifications');
    }

    /**
     * Le nom de l'événement diffusé
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'BudgetNotification';
    }

    /**
     * Les données à diffuser avec l'événement
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->data['message'] ?? $this->data['data'] ?? '',
            'timestamp' => $this->data['timestamp'],
            'type' => $this->data['type'] ?? 'info',
            'user_id' => $this->data['user_id'] ?? null
        ];
    }
}
