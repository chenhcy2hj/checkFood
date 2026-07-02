# Android APK Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the tablet ordering web app as an installable Android APK and publish it to GitHub Releases.

**Architecture:** Keep the existing Vite/React app as the single UI codebase. Add Capacitor as the native Android wrapper, sync the built `dist` assets into the generated Android project, then build a debug APK for internal tablet installation.

**Tech Stack:** React, Vite, TypeScript, Capacitor, Android Gradle, GitHub Releases.

---

### Task 1: Add Android Packaging

**Files:**
- Create: `capacitor.config.ts`
- Create: `android/`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`

- [ ] Install Capacitor packages: `@capacitor/core`, `@capacitor/android`, `@capacitor/cli`.
- [ ] Add Capacitor config with app id `com.chenhcy2hj.checkfood`, app name `checkFood`, and web directory `dist`.
- [ ] Add npm scripts for Android sync and debug APK build.
- [ ] Generate the Android project with `npx cap add android`.
- [ ] Document APK build and install instructions in `README.md`.

### Task 2: Verify Build

**Files:**
- Read: `dist/`
- Read: `android/app/build/outputs/apk/debug/app-debug.apk`

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Run `npm run android:sync`.
- [ ] Run `npm run android:build:debug`.
- [ ] Confirm the APK exists at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Task 3: Commit and Publish Release

**Files:**
- Commit: all Capacitor, README, and lockfile changes.
- Release asset: `android/app/build/outputs/apk/debug/app-debug.apk`.

- [ ] Commit changes with message `feat: add android tablet packaging`.
- [ ] Push `main`.
- [ ] Create and push tag `tablet-v0.1.0`.
- [ ] Create GitHub Release `平板点餐版 v0.1.0`.
- [ ] Upload the APK asset to the release.
