<?php

namespace App\Http\Resources\Users;

use App\Enums\UserStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uid' => $this->uid,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'avatar' => $this->avatar,
            'ban_reason' => $this->ban_reason,
            'banned_at' => $this->banned_at,
            'banned_by' => $this->banned_by,
            // 'status' => $this->status,
            'status' => $this->status instanceof UserStatus
                ? $this->status->label()
                : (UserStatus::from($this->status)->label() ?? ''),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'roles' => $this->whenLoaded(
                'roles',
                fn() =>
                $this->roles->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                ])
            ),
        ];
    }
}
