#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './app/App.js';

process.on('unhandledRejection', () => {});
process.stdout.write('\x1Bc');
const { waitUntilExit } = render(<App />, { exitOnCtrlC: false, patchConsole: true });
await waitUntilExit();
