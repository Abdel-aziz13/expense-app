<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('budget.notifications.{id}', function ($user, $id) {
    Log::info('Auth broadcast', ['user' => $user, 'id' => $id]);
    return (int) $user->id === (int) $id;
});
