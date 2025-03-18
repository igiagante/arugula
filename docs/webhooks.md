# Testing Clerk Webhooks

This guide explains two different methods to test Clerk webhooks locally:

1. Using ngrok (creates a tunnel to your local server)
2. Using Svix CLI (webhook testing and debugging tool)

## Prerequisites

- A Clerk application set up with webhooks enabled
- Choose your testing method and install the required tool:
  - [ngrok](https://ngrok.com/) for tunnel method
  - [Svix CLI](https://github.com/svix/svix-cli) for webhook testing method

## Method 1: Testing with ngrok

### Setup Steps

1. Start your local development server

```bash
npm run dev
```

2. Start ngrok to create a tunnel to your local server

```bash
ngrok http 3000
```

3. Copy the ngrok URL (e.g., `https://1234-your-ngrok-url.ngrok.io`)

4. In your Clerk Dashboard:

   - Go to "Webhooks" section
   - Click "Add Endpoint"
   - Paste your ngrok URL + your webhook route (e.g., `https://1234-your-ngrok-url.ngrok.io/api/webhooks/clerk`)
   - Select the events you want to receive
   - Copy the "Signing Secret" and add it to your `.env` file:
     ```
     CLERK_WEBHOOK_SECRET=whsec_xxxxx...
     ```
   - Save the endpoint

5. Test by:
   - Performing actions in your application that trigger webhooks (e.g., user sign-up)
   - Checking your application logs for incoming webhook events
   - Verifying that your webhook handler is processing the events correctly

## Method 2: Testing with Svix CLI

### Setup Steps

1. Install Svix CLI:

```bash
brew install svix/tap/svix
# or
curl -Ls https://install.svix.com | sh
```

2. Start your local development server

```bash
npm run dev
```

3. In a new terminal, start Svix listener:

```bash
svix listen http://localhost:3000/api/webhooks/clerk
```

4. When you run the command, Svix will provide you with:

   - A forwarding URL (e.g., `https://play.svix.com/in/c_0QTGn24oNpmoxAAjeyX6RHhQrX5/`)
   - A debug dashboard URL (e.g., `https://play.svix.com/view/c_0QTGn24oNpmoxAAjeyX6RHhQrX5/`)

5. In your Clerk Dashboard:

   - Go to "Webhooks" section
   - Click "Add Endpoint"
   - Paste the Svix forwarding URL (the one that starts with `https://play.svix.com/in/`)
   - Select the events you want to receive
   - Copy the "Signing Secret" and add it to your `.env` file:
     ```
     CLERK_WEBHOOK_SECRET=whsec_xxxxx...
     ```
   - Save the endpoint

6. Test by:
   - Performing actions in your application that trigger webhooks
   - Checking the Svix debug dashboard for incoming events
   - Verifying that your webhook handler is processing the events correctly

## Webhook Payload Example

```json
{
  "data": {
    "id": "user_123",
    "object": "user",
    "email_addresses": ["user@example.com"]
    // ... other user data
  },
  "object": "event",
  "type": "user.created"
}
```

## Security Considerations

- Always verify webhook signatures in production
- Keep your webhook signing secret secure
- Don't expose sensitive information in webhook response logs

## Troubleshooting

### For ngrok

- Ensure your ngrok tunnel is running
- Check that the ngrok URL is correctly set in Clerk Dashboard
- Verify your logs show incoming requests

### For Svix

- Make sure Svix CLI is running and listening
- Check the Svix debug dashboard for webhook attempts
- Verify the Svix forwarding URL is correctly set in Clerk Dashboard
