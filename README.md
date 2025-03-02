# Battery Charging Change Notifier

A browser extension that notifies you when your device's battery stops or starts charging.

## Purpose

Have you ever experienced your laptop suddenly stop charging without you noticing? Perhaps your charging cable is loose, your power adapter is faulty, or the charging port on your device is unreliable - all of which lead to shorter battery life.  
This extension alerts you when your battery stops or starts charging.

## How It Works

The extension monitors your device's battery status in the background and displays a notification whenever the charging state changes:

- **Battery Stops Charging**: Shows a persistent notification that remains until dismissed or charging resumes
- **Battery Starts Charging**: Shows a temporary notification that automatically dismisses after a few seconds

## Features

- **Unobtrusive**: Runs silently in the background without affecting browser performance
- **Low Resource Usage**: Minimal CPU and memory footprint
- **Clear Notifications**: Easy-to-understand notifications with battery status & percentage information
- **Cross-Platform Support**: Verified on macOS, Linux, Windows 10, and Windows 11 (the required OS system settings for notifications might differ)

## Browser Support

- **Compatible With**: Chrome, Edge and Opera (any browser that supports the [Battery API](https://caniuse.com/battery-status))
- **Not Compatible With**: Brave, Firefox, Safari (these browsers don't support the [Battery API](https://caniuse.com/battery-status))

## Important Notes

### Ensure your browser of choice has permission to display notifications in your system settings.

- **(MacOS) System settings > Notifications > enable Google Chrome AND Google Chrome Helper (Alerts)**

## Installation

1. Download from the Chrome Web Store (link coming soon)
2. The extension will start working immediately after installation
3. No configuration needed

## Development

This extension is built with TypeScript and uses Webpack for bundling.

### Package Manager Requirements

This project uses Yarn 4.9.1 as its package manager. For the best development experience:

1.  Make sure you have [Corepack](https://nodejs.org/api/corepack.html) enabled:

    ```bash
    corepack enable
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

3.  Build the project:

    ```bash
    # Development build with watch mode
    yarn dev

    # Production build
    yarn build

    # Package build as zip file using node
    yarn package
    ```

    Using npm, pnpm or other Yarn versions has not been tested and may cause unexpected issues.

## Privacy

This extension:

- Does not collect any user data
- Does not communicate with external servers
- Only accesses battery status information

## License

MIT License
