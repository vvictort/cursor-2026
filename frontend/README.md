# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Supabase Auth + RLS setup

This project is mobile-first. Web (`localhost`) is only used as a local development test harness for the same auth + RLS flow.

1. Add your project credentials to `frontend/.env`:

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```

2. In Supabase dashboard, configure `Authentication -> URL Configuration -> Redirect URLs` with:
   - `http://localhost:8081/auth/callback`
   - `http://127.0.0.1:8081/auth/callback`
   - `frontend://auth/callback`
   - `exp://<your-lan-ip>:8081/--/auth/callback` (for Expo Go on phone; update host/port if Expo changes)

   Keep `localhost` URLs for local web testing only. The mobile deep-link URLs are the app behavior that matters for real usage.

3. Run `frontend/supabase/rls_private_notes.sql` in Supabase SQL editor.

4. Start Expo:

   ```bash
   npm run start -- --host lan
   ```

5. Test on both clients:
   - Web: press `w` in Expo terminal (`http://localhost:8081`)
   - Phone: scan the Expo QR code in Expo Go

6. Validate RLS from the Dashboard tab:
   - Sign in as user A and add notes
   - Sign out, sign in as user B on phone or web
   - Confirm user B cannot see user A notes

### Signup behavior notes

- If an email is already registered, Supabase may return a non-error response for security reasons.
- The app now detects this and shows "Account exists" instead of pretending a new user was created.
- New accounts may require email confirmation depending on your Supabase auth settings.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
