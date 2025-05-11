<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class RepositoryCommand extends Command 
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:repository {name} {--dir=} {--model=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new repository class with interface';

    /**
     * Execute the console command.: void
     */
    public function handle()
    {
        $name = $this->argument('name');
        $directory = $this->option('dir') ? $this->option('dir') : '';
        $model = $this->option('model') ? $this->option('model') : null;

        // Ensure name has Repository suffix
        if (!Str::endsWith($name, 'Repository')) {
            $name = $name . 'Repository';
        }

        // Create directories if they don't exist
        $basePath = app_path('Repository/' . $directory);
        if (!File::exists($basePath)) {
            File::makeDirectory($basePath, 0755, true);
        }

        // Create interface
        $interfacePath = $basePath . '/' . $name . 'Interface.php';
        $interfaceContent = $this->getInterfaceContent($name, $directory);
        File::put($interfacePath, $interfaceContent);

        // Create repository
        $repositoryPath = $basePath . '/' . $name . '.php';
        $repositoryContent = $this->getRepositoryContent($name, $directory, $model);
        File::put($repositoryPath, $repositoryContent);

        $this->info('Repository created successfully!');
        $this->info('Created: ' . $interfacePath);
        $this->info('Created: ' . $repositoryPath);
    }

    /**
     * Get the interface content.
     */
    protected function getInterfaceContent(string $name, string $directory): string
    {
        $namespace = 'App\\Repository';
        if ($directory) {
            $namespace .= '\\' . str_replace('/', '\\', $directory);
        }

        $template = File::get(app_path('Console/Templates/Repository/Interface.stub'));
        return str_replace(
            ['{$namespace}', '{$name}'],
            [$namespace, $name],
            $template
        );
    }

    /**
     * Get the repository content.
     */
    protected function getRepositoryContent(string $name, string $directory, ?string $model): string
    {
        $namespace = 'App\\Repository';
        if ($directory) {
            $namespace .= '\\' . str_replace('/', '\\', $directory);
        }

        $modelImport = '';
        $modelProperty = '';
        $constructor = '';

        if ($model) {
            $modelClass = 'App\\Models\\' . $model;
            $modelImport = "use {$modelClass};\n";
            $modelProperty = "\n    /**\n     * @var {$model}\n     */\n    protected \${$model};\n";
            $constructor = "\n    /**\n     * Constructor\n     */\n    public function __construct({$model} \${$model})\n    {\n        \$this->{$model} = \${$model};\n    }\n";
        }

        $template = File::get(app_path('Console/Templates/Repository/Class.stub'));
        return str_replace(
            ['{$namespace}', '{$name}', '{$modelImport}', '{$modelProperty}', '{$constructor}'],
            [$namespace, $name, $modelImport, $modelProperty, $constructor],
            $template
        );
    }
}
