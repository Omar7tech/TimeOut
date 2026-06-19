<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureInertiaErrorPages();
    }

    /**
     * Render branded Inertia error pages for known HTTP errors.
     *
     * 500 errors stay on Laravel's debug page locally so stack traces remain
     * available; all other handled statuses render the branded page everywhere.
     */
    protected function configureInertiaErrorPages(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response): mixed {
            $brandable = [403, 404, 419, 503];

            if (! app()->environment(['local', 'testing'])) {
                $brandable[] = 500;
            }

            if (! in_array($response->statusCode(), $brandable, true)) {
                return null;
            }

            return $response->render('error-page', [
                'status' => $response->statusCode(),
            ])->withSharedData();
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
