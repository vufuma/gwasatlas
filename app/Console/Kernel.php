<?php

namespace atlas\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use File;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        // Commands\Inspire::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
		$schedule->call(function(){
			$t = time()-(60*60);
			$filedir = config('app.datadir').'/tmp_plot/';
			$files = glob($filedir.'*');
			foreach($files as $f){
				$tmp = (int)preg_replace('/.+\/tmp_plot\/(\d+)/', '$1', $f);
				if($tmp<$t){
					File::deleteDirectory($f);
				}
			}
		})->hourly();
    }
}
