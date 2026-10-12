## Future Flow Logging

FutureFlow uses Winston as a centralized file rotation and rollover logging service. 

### Logging Architecture

The backend components should use AppServiceLogger for app logging. The logger supports standard severity levels.

The logging flow is:

`NestJS component -> AppServiceLogger -> Winston -> console and log files`

### Log files
 - futureflow.log: General app logging (will also contain error logs).
 - error.log: Error-only logging.

### Docker Logging

The API container uses `LOG_DIR=/var/log/futureflow`. Docker maps that directory to a local, mounted log directory: `./logs:/var/logs/futureflow`. This setup writes container logs to the outside filesystem for long-term storage at the project root, outlasting container stoppage or removal. 

View logs:
 - `docker compose logs api`
Display only recent API output:
 - `docker compose logs api -- tail=50`

### Handling Native OS
When the API is run outside Docker and LOG_DIR is not explicitly configured, FutureFlow selects the OS system log that's appropriate. 

 - `Windows` uses the user's AppData location under FutureFlow/logs
 - `macOS` uses `~/Library/Logs/FutureFlow`. 
 - `Linux` uses `~/.local/state/futureflow/logs`.

### Using Logging in the Project
NestJS-managed classes have access to AppLoggerService through constructor injection. 

Example:
``` JavaScript 
constructor(private readonly logger: AppLoggerService) {}
```

Components can then write messages based on the needed severity:

``` JavaScript
this.logger.log('Forecast calculation completed', 'ForecastService');

this.logger.warn('Account has no transaction history', 'ForecastService');

this.logger.error(
  'Forecast calculation failed',
  error.stack,
  'ForecastService',
);
```

The second argument used in normal log and warning messages identifies the logging context. Using the class or service name as the context makes it easier to identify the source of a message.

For example:
``` JavaScript
this.logger.log('User authenticated', AuthService.name);
```

### Startup Logging

After the NestJS API successfully begins listening, main.ts writes a startup message through AppLoggerService.

For example:

`INFO [Bootstrap] FutureFlow API listening on port 3000`

This confirms that the application started successfully and that centralized logging is operational.

### Viewing Logs

From the FutureFlow repository root, the general application log can be monitored with:

`tail -f logs/futureflow.log`

Errors can be monitored separately with:

`tail -f logs/error.log`

Docker console output can be monitored with:

`docker compose logs -f api`

