<?php

namespace App\Twig\Runtime;

use Twig\Extension\RuntimeExtensionInterface;

class FormatDurationRuntime implements RuntimeExtensionInterface
{
    public function __construct()
    {
        // Inject dependencies if needed
    }

    /**
     * Formate une durée en millisecondes en une chaîne lisible.
     *
     * Format : H:MM:SS.mmm ou MM:SS.mmm ou SS.mmm ou 0.mmm
     * - Les heures ne sont affichées que si > 0.
     * - Les minutes ne sont affichées que si > 0.
     * - Les secondes sont affichées à 0 si la durée < 1s.
     * - Retourne null si la durée est nulle (un chrono de réolution de cube ne peut pas être égal à 0).
     *
     * @param int $duration Durée en millisecondes
     * @return string|null Chaîne formatée (ex: "1:05.234") ou null si $duration est 0
     */
    public function formatDuration(int $duration): ?string
    {
        if (!$duration) {
            return null;
        }

        $milliSeconds = $duration % 1000;
        $seconds = (int) floor($duration / 1000);
        $minutes = (int) floor($seconds / 60);
        $hours = (int) floor($minutes / 60);

        $hasHours = $hours > 0;
        $hasMinutesOrHours = $hours > 0 || $minutes > 0;

        $result = '';
        $result .= $hours > 0 ? $hours . ':' : '';
        $result .= $hasHours
            ? sprintf('%02d', $minutes % 60) . ':'
            : ($minutes > 0 ? $minutes % 60 : '');
        $result .= $hasMinutesOrHours
            ? sprintf('%02d', $seconds % 60) . '.'
            : ($seconds > 0 ? $seconds % 60 . '.' : '0.');
        $result .= sprintf('%03d', $milliSeconds);

        return $result;
    }
}
