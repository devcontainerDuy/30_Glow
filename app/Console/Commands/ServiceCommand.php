<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {name} {--dir=} {--model=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new service class with interface';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $directory = $this->option('dir') ? $this->option('dir') : '';
        $model = $this->option('model') ? $this->option('model') : null;

        // Ensure name has Service suffix
        if (!Str::endsWith($name, 'Service')) {
            $name = $name . 'Service';
        }

        // Create directories if they don't exist
        $basePath = app_path('Services/' . $directory);
        if (!File::exists($basePath)) {
            File::makeDirectory($basePath, 0755, true);
        }

        // Create template directory if it doesn't exist
        $templatePath = app_path('Console/Templates/Service');
        if (!File::exists($templatePath)) {
            File::makeDirectory($templatePath, 0755, true);
            // Create template files
            $this->createTemplateFiles();
        }

        // Create interface
        $interfacePath = $basePath . '/' . $name . 'Interface.php';
        $interfaceContent = $this->getInterfaceContent($name, $directory);
        File::put($interfacePath, $interfaceContent);

        // Create service
        $servicePath = $basePath . '/' . $name . '.php';
        $serviceContent = $this->getServiceContent($name, $directory, $model);
        File::put($servicePath, $serviceContent);

        $this->info('Service created successfully!');
        $this->info('Created: ' . $interfacePath);
        $this->info('Created: ' . $servicePath);
    }

    /**
     * Get the interface content.
     */
    protected function getInterfaceContent(string $name, string $directory): string
    {
        $namespace = 'App\\Services';
        if ($directory) {
            $namespace .= '\\' . str_replace('/', '\\', $directory);
        }

        $template = File::get(app_path('Console/Templates/Service/Interface.stub'));
        return str_replace(
            ['{$namespace}', '{$name}'],
            [$namespace, $name],
            $template
        );
    }

    /**
     * Get the service content.
     */
    protected function getServiceContent(string $name, string $directory, ?string $model): string
    {
        $namespace = 'App\\Services';
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

        $template = File::get(app_path('Console/Templates/Service/Class.stub'));
        return str_replace(
            ['{$namespace}', '{$name}', '{$modelImport}', '{$modelProperty}', '{$constructor}'],
            [$namespace, $name, $modelImport, $modelProperty, $constructor],
            $template
        );
    }

    /**
     * Create template files if they don't exist.
     */
    protected function createTemplateFiles(): void
    {
        // Create Interface template
        $interfaceTemplate = <<<'PHP'
<?php

namespace {$namespace};

interface {$name}Interface
{
    //
}
PHP;
        File::put(app_path('Console/Templates/Service/Interface.stub'), $interfaceTemplate);

        // Create Service class template
        $classTemplate = <<<'PHP'
<?php

namespace {$namespace};

{$modelImport}
class {$name} implements {$name}Interface
{$modelProperty}{$constructor}
    //
}
PHP;
        File::put(app_path('Console/Templates/Service/Class.stub'), $classTemplate);
    }
}