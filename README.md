# test-canvas-tool

A login screen built in React + TypeScript (Vite), plus an in-app canvas for tweaking it.

```bash
npm install
npm run dev
```

- `/` shows the live login screen.
- `/#/canvas` shows every state side by side (mobile and desktop) with live controls for accent colour, corner radius, font, light/dark, desktop layout (split or centered card), social buttons and all copy. Changes are saved to `localStorage`, so the live screen picks them up too. "Copy JSON" exports the current theme and copy.

Sign-in is mocked: any valid email and a password of 8+ characters succeeds after a short delay. The password `wrongpass` simulates a rejected sign-in.
