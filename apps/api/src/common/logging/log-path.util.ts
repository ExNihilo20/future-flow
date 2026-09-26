import * as os from 'os';
import * as path from 'path';

export function getLogDirectory(): string {
    if (process.env.LOG_DIR) {
        return process.env.LOG_DIR;
    }

    const homeDirectory = os.homedir();

    switch (process.platform) {
        case 'win32':
            return path.join(
                process.env.LOCALAPPDATA ??
                process.env.APPDATA ??
                path.join(homeDirectory, 'AppData', 'Local'),
                'FutureFlow',
                'Logs',
                'FutureFlow'
            );
        case 'darwin':
            return path.join(
                homeDirectory,
                'Library',
                'Logs',
                'FutureFlow'
            );
        default:
            return path.join(
            process.env.XDG_STATE_HOME ??
            path.join(homeDirectory, '.local', 'state'),
            'futureflow',
            'logs',
            );
    }
}